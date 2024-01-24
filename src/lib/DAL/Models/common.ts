import { pgSchema, smallint, varchar } from "drizzle-orm/pg-core"
import {z} from "zod"

export const shop = pgSchema("shop")

export const MAX_SIZES = {
	uuid: 8,
	image: 12,
	name: 64,
	hash: 64,
	description: 8192,
}

export const MINMAX_VALUES = {
	idMax:32760,
	idMin:0,
}

export const IMAGE_MAX_SIZE = 500000
export const IMAGE_MIME_TYPES = ["image/jpeg","image/jpg"]

export function parseFormData(formData:FormData){
	const POJO:any = {}
	for (const [key,value] of formData.entries()){
		if (key in POJO){
			if (!Array.isArray(POJO[key]))
				POJO[key] = [POJO[key],value]
			else
				POJO[key].push(value)
		}
		else
			POJO[key] = value
	}
	return POJO as {[key:string]:unknown}
}

export const fileSchema = z
		.instanceof(File)
		.refine(file=>file.size <= IMAGE_MAX_SIZE,"File too big")
		.refine(file=>IMAGE_MIME_TYPES.includes(file.type),"File is not an image")

export const pgreDefaults = {
	id: smallint("id").primaryKey(),
	image: varchar("image", { length: MAX_SIZES.image }).notNull(),
	name: varchar("name", { length: MAX_SIZES.name }).notNull(),
	description: varchar("description", {
		length: MAX_SIZES.description,
	}).notNull(),
}

export const validations = {
	id: z.number().nonnegative().min(MINMAX_VALUES.idMin).max(MINMAX_VALUES.idMax),
	image: fileSchema,
	name: z.string().max(MAX_SIZES.name),
	description: z.string().max(MAX_SIZES.description),
	match(name: string, pattern: RegExp) {
		return function (value: string) {
			if (!value.toString().match(pattern))
				return `${name} (${value}) does not match ${pattern}`
			return false
		}
	},
	imageName: z.string().max(MAX_SIZES.image).regex(new RegExp(`^(template|[0-9 a-f]{${MAX_SIZES.uuid}})\\.jpg$`)),
}
