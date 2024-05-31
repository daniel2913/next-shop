"use server";
import { CategoryCache } from "@/helpers/cache";
import { CategoryModel } from "@/lib/Models";
import { ServerError, auth, modelGeneralAction } from "./common";
import { inArray } from "drizzle-orm";
import { toArray } from "@/helpers/misc";

export async function getAllCategoryNamesAction() {
	try {
		const res = await CategoryCache.get();
		return res.map((cat) => cat.name);
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

export async function deleteCategoriesAction(inp: number | number[]) {
	try {
		const ids = toArray(inp);
		if (!ids.length) throw ServerError.invalid();
		await auth("admin");
		const res = await CategoryModel.model
			.delete(CategoryModel.table)
			.where(inArray(CategoryModel.table.id, ids))
			.returning({ id: CategoryModel.table.id });
		if (res.length) CategoryCache.revalidate();
		return res.length;
	} catch (error) {
		ServerError.fromError(error).emmit();
	}
}

export async function createCategoryAction(form: FormData) {
	const res = modelGeneralAction(CategoryModel, form);
	if (!res) CategoryCache.revalidate();
	return res;
}

export async function changeCategoryAction(id: number, form: FormData) {
	const res = await modelGeneralAction(CategoryModel, form, id);
	if (!res) CategoryCache.revalidate();
	return res;
}
