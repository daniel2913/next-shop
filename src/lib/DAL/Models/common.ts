import { pgSchema, smallint, varchar } from "drizzle-orm/pg-core"

export const shop = pgSchema("shop")

export const maxSizes = {
	uuid: 8,
	image: 12,
	name: 64,
	hash: 64,
	description: 8192,
}
export const pgreDefaults = {
	id: smallint("id").primaryKey().notNull(),
	image: varchar("image", { length: maxSizes.image }).notNull(),
	name: varchar("name", { length: maxSizes.name }).notNull(),
	description: varchar("description", {
		length: maxSizes.description,
	}).notNull(),
}

export const validations = {

	id(name:string){
		return function(value:number){
			return `${name} has id specified!`
		}
	},
	noDefault(name:string){
		return function(value:any){
			return `${name} is generated column!`
		}
	},
	length(name: string, max: number, min?: number) {
		return function (value: string | number) {
			if ((min || min === 0) && value.toString().length < min)
				return `${name} length (${value}) is below min length (${min})`
			if (value.toString().length > max)
				return `${name} length (${value}) is above max length (${min})`
			return false
		}
	},
	value(name: string, max: number, min?: number) {
		return function (value: string | number) {
			if (Number.isNaN(value)) return `${name} value (${value}) is not a number`
			if ((min || min === 0) && +value < min)
				return `${name} value (${value}) is below min value (${min})`
			if (+value > max)
				return `${name} value (${value}) is above max value (${min})`
			return false
		}
	},
	match(name: string, pattern: RegExp) {
		return function (value: string) {
			if (!value.toString().match(pattern))
				return `${name} (${value}) does not match ${pattern}`
			return false
		}
	},
	imageMatch() {
		return function (value: string) {
			const regexp = `^(template|[0-9 a-f]{${maxSizes.uuid}})\\.jpg$`
			if (!value.toString().match(new RegExp(regexp)))
				return `image (${value}) does not match image pattern`
			return false
		}
	},
	imagesMatch() {
		return function (value: string[]) {
			for (const img of value) {
				const regexp = `^(template|[0-9 a-f]{${maxSizes.uuid}})\\.jpg$`
				if (!img.toString().match(new RegExp(regexp)))
					return `image (${img}) does not match image pattern ${regexp}`
			}
			return false
		}
	},
}
