import mongoConnect from "@/lib/mongoConnect";
import {
    Column,
    ColumnBuilderBaseConfig,
    ColumnDataType,
    InferInsertModel,
    InferSelectModel,
    SQLWrapper,
    Table,
    and,
    eq,
    like,
    getTableColumns,
    inArray,
    SQL,
} from "drizzle-orm";
import {
    PgColumn,
    PgColumnBuilderBase,
    PgTableWithColumns,
    TableConfig,
} from "drizzle-orm/pg-core";
import mongoose, { Document, InferSchemaType, Model, Schema } from "mongoose";
import { defaultId } from "./common";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export type ColumnsConfi<T extends Record<string, ColumnDataType>> = Record<
    keyof T,
    PgColumnBuilderBase<ColumnBuilderBaseConfig<ColumnDataType, string>, object>
>;

export type ColumnsConfig<T extends Record<string, ColumnDataType>> = {
    [i in keyof T]: PgColumnBuilderBase<ColumnBuilderBaseConfig<T[i], string>>;
};
export type TestColumnsConfig<
    T,
    U extends ColumnsConfig<any>,
> = T extends U ? T : "false";

export type MongoSchema<T extends Record<string, ColumnDataType>> = {
    [i in keyof T]: T[i] extends keyof typeEnum ? typeEnum[T[i]] : unknown;
};

export type DataModels = MongoModel<any> | PgreModel<any, any>;

type typeEnum = {
    string: string;
    number: number;
    array: Array<any>;
};

interface DataModel<T extends { [i: string]: any, _id: string }> {
    columns: T;
    newObject: (obj: Record<string, any>) => Promise<T | false>;
    findOne: (
        query: Query<T>,
    ) => Promise<T | false>;
    find: (
        query?: Query<T>,
    ) => Promise<T[]>;
    findPaginated: (
        query: Query<T>,
        pageSize: number,
        offset: number,
    ) => Promise<T[]>;
    delete: (_id: string) => Promise<boolean>;
    patch: (targId: string, patch: Partial<T>) => Promise<boolean>;
}

type Query<T extends Record<string, any> & { _id: string }> = Partial<{ [i in keyof T]?: string | string[] | RegExp }>
type Validator<T> = (value: T) => string | false;

export class MongoModel<T extends { [i: string]: any, _id: string }> implements DataModel<T> {
    private model: Model<Schema<T>>;
    private validations: { [I in keyof T]: Validator<T[I]>[] };
    public columns: T;

    private makeMongoQuery(
        query: Query<T>,
    ) {
        const res: Query<T> = {};
        for (const [key, value] of Object.entries(query)) {
            if (!((key in this.model.schema.paths) && value)) continue;
            res[key as keyof T] = value;
        }
        return res as Record<string, string | string[]>;
    }
    private isValid(newObj: Record<string, any>): newObj is T {
        //TODO?
        for (const path in newObj) {
            if (!(path in this.columns)) throw `Invalid column ${path}`
        }
        for (const path in this.columns) {
            if (!(path in newObj)) throw `Column ${path} is not present`
        }
        for (const [column, value] of Object.entries(newObj)) {
            for (const validator of this.validations[column]) {
                const error = validator(value);
                if (error) throw error;
            }
        }
        return true
    }
    constructor(
        model: Model<Schema<T>>,
        validations: { [I in keyof T]: Validator<T[I]>[] },
    ) {
        this.model = model;
        this.validations = validations;
    }

    async newObject(obj: Record<string, any>) {
        obj._id = defaultId()
        if (this.isValid(obj)) {
            const newObj = new this.model(obj)
            const res = await this.write(newObj);
            return res as T | false;
        }
        return false
    }

    async findOne(query: Query<T>) {
        await mongoConnect();
        return (await this.model
            .findOne(this.makeMongoQuery(query))
            .lean()
            .exec()) as T;
    }
    async find(query?: Query<T>) {
        await mongoConnect();
        if (!query) {
            return this.model.find().lean().exec() as Promise<T[]>
        }
        return this.model
            .find(this.makeMongoQuery(query))
            .lean()
            .exec() as Promise<T[]>;
    }
    async findPaginated(
        query: Query<T>,
        pageSize: number,
        offset: number,
    ) {
        await mongoConnect();
        return (await this.model
            .find(this.makeMongoQuery(query))
            .limit(pageSize)
            .skip(offset)
            .lean()
            .exec()) as T[];
    }
    private async write(object: Document<any, any, T>) {
        await mongoConnect();
        try {
            const res = await object.save()
            return res
                ? res.toObject() as T
                : false
        } catch (e) {
            console.log("Pizda", e);
            return false;
        }
    }
    async delete(_id: string) {
        const res = await this.model.deleteOne({ _id });
        return res.deletedCount > 0 ? true : false;
    }
    async patch(targId: string, patch: Partial<T>) {
        if (!targId) return false;
        const oldObject = await this.findOne({ _id: targId })
        if (!oldObject) return false
        const newObj = { ...oldObject, ...patch, _id: targId };
        try {
            if (this.isValid(newObj)) {
                const res = await this.model.updateOne({ _id: targId }, newObj);
                return res ? true : false;
            }
            throw "Something is wrong"
        }
        catch (err) {
            return false
        }
    }
}


export class PgreModel<T extends { [i: string]: any, _id: string }, U extends Table<TableConfig>>
    implements DataModel<T> {
    private table: U;
    public columns: T;
    private model: PostgresJsDatabase
    private validations: { [key in keyof T]: Validator<T[key]>[] }

    constructor(
        table: U['$inferSelect'] extends T ? T extends U['$inferSelect'] ? U : never : never,
        validations: { [key in keyof T]: Validator<T[key]>[] }
    ) {
        console.log('===>', table)
        this.table = table;
        this.columns = table as T;
        this.validations = validations;
        this.model = drizzle(postgres(process.env.PGRE_URL_DEV, { max: 5, idle_timeout: 60 * 2 }), { logger: true })
    }

    private isValid(newObj: Record<string, any>): newObj is T {
        for (const [column, value] of Object.entries(newObj)) {
            if (!this.validations[column]) continue;
            for (const validator of this.validations[column]) {
                const error = validator(value);
                if (error) throw error;
            }
        }
        return true
    }

    private makePgreQuery(
        query: Query<T>
    ) {
        const sqlQueryWrappers: SQLWrapper[] = [];
        for (const [key, value] of Object.entries(query)) {
            if (!((key in this.columns) && value)) continue;
            const column = this.table[key as keyof U] as Column;
            if (Array.isArray(value)) sqlQueryWrappers.push(inArray(column, value));
            else if (value instanceof RegExp)
                sqlQueryWrappers.push(
                    like(column, `${value.toString().slice(1, -1)}%`),
                );
            else sqlQueryWrappers.push(eq(column, value));
        }
        return and(...sqlQueryWrappers);
    }

    async newObject(obj: Record<string, any>) {
        const newObj = { ...obj };
        newObj._id = defaultId();
        console.log("<===3", newObj);
        if (this.isValid(newObj)) {
            ;
            const res = await this.write(newObj as T);
            return res ? res as U['$inferInsert'] as T : false;
        }
        return false
    }

    async findOne(query: Query<T>) {
        return (
            (
                await this.model
                    .select()
                    .from(this.table)
                    .where(this.makePgreQuery(query))
                    .limit(1)
            )[0] as T || null
        );
    }

    async find(query?: Query<T>) {
        if (!query) {
            return ((await this.model.select().from(this.table)) || []) as T[]
        }
        return ((await this.model
            .select()
            .from(this.table)
            .where(this.makePgreQuery(query))) || []) as T[]
    }
    async findPaginated(query: Query<T>, pageSize: number, offset: number) {
        return ((await this.model
            .select()
            .from(this.table)
            .where(this.makePgreQuery(query))
            .limit(pageSize)
            .offset(offset)) || []) as T[]
    }
    write(object: T) {
        return this.model
            .insert(this.table)
            .values(object)
            .returning();
    }
    async delete(_id: string) {
        if (!_id) return false;
        const res = await this.model
            .delete(this.table)
            .where(eq(this.table._id, _id))
            .returning();
        return res.length > 0 ? true : false;
    }
    async patch(targId: string, patch: Partial<T>) {
        if (!targId) return false;
        const newObj = { ...patch, _id: targId };
        if (this.isValid(newObj)) {
            const res = await this.model
                .update(this.table)
                .set(newObj)
                .where(eq(this.table._id, targId))
                .returning({ id: this.table._id });
            return res.length > 0 ? true : false;
        }
        return false
    }
}
