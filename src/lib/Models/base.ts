import { type Column, type SQLWrapper, and, eq, ilike, inArray } from "drizzle-orm";
import { type PgColumn, type PgTableWithColumns, getTableConfig, } from "drizzle-orm/pg-core";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, z } from "zod";
import { ServerError } from "@/actions/common";
import { deleteImages, imagesHandler } from "@/helpers/images";
import { FileStorage, type IFileStorage } from "../FileStorage";


type Query<T extends Record<string, unknown>> = {
	[Key in keyof T]?: T[Key] | T[Key][];
};

export interface DataModel<T extends Record<string, unknown>> {
	filePath: string
	create: (obj: unknown | T) => Promise<T | null>;
	findOne: (query: Query<T>) => Promise<T | null>;
	find: (query?: Query<T>, page?: number, skip?: number) => Promise<T[]>;
	delete: (id: number) => Promise<T | null>;
	patch: (targid: number, patch: unknown | Partial<T>) => Promise<T | null>;
}

type BasePgTable = PgTableWithColumns<{
	name: string;
	schema: string;
	columns: {
		id: PgColumn<{
			name: "id";
			tableName: string;
			dataType: "number";
			columnType: "PgSerial";
			data: number;
			driverParam: string | number;
			notNull: true;
			hasDefault: true;
			enumValues: undefined;
			baseColumn: never;
		}>;
	};
	dialect: "pg";
}>;



export class PgreModel<
	U extends BasePgTable,
	Z extends ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, U["$inferInsert"]>,
> implements DataModel<U["$inferSelect"]> {
	public table: U;
	public filePath: string;
	public model: PostgresJsDatabase;
	private validations: Z;
	private storage: IFileStorage

	constructor(table: U, validations: Z, model = drizzle(postgres()), storage: IFileStorage = FileStorage) {
		this.table = table;
		const config = getTableConfig(table);
		this.validations = validations;
		this.filePath = config.name;
		this.model = model
		this.storage = storage
		drizzle(postgres(), { logger: false });
	}


	private makePgreQuery(query: Query<U["$inferSelect"]>) {
		const sqlQueryWrappers: SQLWrapper[] = [];
		for (const [key, value] of Object.entries(query)) {
			if (!(key in this.table && value !== undefined)) continue;

			const column = this.table[key as keyof U] as Column;
			if (Array.isArray(value))
				sqlQueryWrappers.push(inArray(column, value));
			else if (
				typeof value === "string" &&
				(value.at(0) === "%" || value.at(-1) === "%")
			)
				sqlQueryWrappers.push(ilike(column, value));
			else {
				sqlQueryWrappers.push(eq(column, value));
			}
		}
		return and(...sqlQueryWrappers);
	}

	async create(
		obj: unknown | U["$inferSelect"],
	): Promise<null | U["$inferSelect"]> {
		const props = await this.validations.parseAsync(obj);
		let rollback: null | (() => void) = null
		if ("images" in props) {

			const res = await imagesHandler(this.filePath, props.images as File[])
			props.images = res.names
			rollback = res.rollback
		}
		const res = await this.model.transaction(async tx => {
			const r = await tx.insert(this.table).values(props).returning();
			if (!r[0]) {
				rollback?.()
				tx.rollback()
				throw ServerError.internal(`Error creating object in table ${this.filePath}`)
			}
			return r[0]
		})
		return res
	}

	async patch(
		targId: number,
		patch: Partial<z.infer<Z>> | unknown,
	): Promise<null | U["$inferSelect"]> {
		if (!targId || typeof patch !== "object" || !patch)
			throw ServerError.invalid();
		const [original, props] = await Promise.all([
			this.findOne({ id: targId }),
			this.validations.partial().parseAsync(patch),
		]);
		if (!original) throw ServerError.notFound();

		let writeChanges: null | (() => void) = null
		let rollback: null | (() => void) = null
		if ("images" in props) {
			if ("images" in original) {
				const res = await imagesHandler(this.filePath, props.images as File[], original.images as string[])
				props.images = res.names
				rollback = res.rollback
			} else {
				const res = await imagesHandler(this.filePath, props.images as File[])
				props.images = res.names
				writeChanges = res.writeChanges
				rollback = res.rollback
			}
		}
		const res = await this.model.transaction(async tx => {
			const r = await tx.update(this.table)
				.set(props)
				.where(eq(this.table.id, targId))
				.returning();
			if (!r[0]) {
				rollback?.()
				tx.rollback()
				throw ServerError.internal(`Error patching object in table ${this.filePath}`)
			}
			writeChanges?.()
			return r[0]
		})
		return res
	}

	async findOne(query: Query<U["$inferSelect"]>) {
		const test = this.model.select().from(this.table).where(this.makePgreQuery(query))
		const res = await this.model
			.select()
			.from(this.table)
			.where(this.makePgreQuery(query))
			.limit(1);
		return res[0]
	}

	find(query?: Query<U["$inferSelect"]>, page = 20, skip = 0) {
		let req = this.model.select().from(this.table).$dynamic();
		if (query) req = req.where(this.makePgreQuery(query));
		if (page) req = req.limit(page);
		if (skip) req = req.offset(skip);
		return req;
	}

	async delete(id: number): Promise<U["$inferSelect"] | null> {
		if (!id) return null;
		const res = await this.model.transaction(async tx => {
			const r = await tx
				.delete(this.table)
				.where(eq(this.table.id, id))
				.returning();
			if (!r[0]) {
				tx.rollback()
				throw ServerError.unknown(`Error while trying to delete object from ${this.filePath}`)
			}
			if ("images" in r[0])
				deleteImages(r[0].images as string[], this.filePath)
			return r[0]
		})
		return res
	}
}
