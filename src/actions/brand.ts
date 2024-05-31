"use server";
import { BrandCache } from "@/helpers/cache";
import { BrandModel } from "@/lib/Models";
import { ServerError, auth, modelGeneralAction } from "./common";
import { inArray } from "drizzle-orm";
import { toArray } from "@/helpers/misc";

export async function getAllBrandNamesAction() {
	try {
		const res = await BrandCache.get();
		return res.map((brand) => brand.name);
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

export async function deleteBrandsAction(inp: number | number[]) {
	try {
		const ids = toArray(inp);
		if (!ids.length) throw ServerError.invalid();
		await auth("admin");
		const res = await BrandModel.model
			.delete(BrandModel.table)
			.where(inArray(BrandModel.table.id, ids))
			.returning({ id: BrandModel.table.id });
		if (res.length) BrandCache.revalidate();
		return res.length;
	} catch (error) {
		ServerError.fromError(error).emmit();
	}
}
export async function createBrandAction(form: FormData) {
	const res = await modelGeneralAction(BrandModel, form);
	if (!res) BrandCache.revalidate();
	return res;
}

export async function changeBrandAction(id: number, form: FormData) {
	const res = await modelGeneralAction(BrandModel, form, id);
	if (!res) BrandCache.revalidate();
	return res;
}
