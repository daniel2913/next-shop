import { char, pgSchema, varchar } from "drizzle-orm/pg-core"
import { Types } from "mongoose"

export function defaultId() {
	return new Types.ObjectId().toString()
}

export const shop = pgSchema("shop")

export const maxSizes = {
	_id: 24,
	image: 28,
	name: 64,
	hash: 64,
	description: 2048,
}
export const pgreDefaults = {
	_id: char("_id", { length: maxSizes._id }).primaryKey().notNull(),
	image: varchar("image", { length: maxSizes.image }).notNull(),
	name: varchar("name", { length: maxSizes.name }).notNull(),
	description: varchar("description", {
		length: maxSizes.description,
	}).notNull(),
}

export const mongoDefaults = {
	_id: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
}

export const validations = {
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
			const regexp = `^(template|[0-9 a-f]{${maxSizes._id}})\\.jpg$`
			if (!value.toString().match(new RegExp(regexp)))
				return `image (${value}) does not match image pattern`
			return false
		}
	},
	imagesMatch() {
		return function (value: string[]) {
			for (const img of value) {
				const regexp = `^(template|[0-9 a-f]{${maxSizes._id}})\\.jpg$`
				if (!img.toString().match(new RegExp(regexp)))
					return `image (${img}) does not match image pattern ${regexp}`
			}
			return false
		}
	},
	_idMatch(name: string) {
		return function (value: string) {
			console.log("==>", value)
			const regexp = `^[0-9 a-f]{${maxSizes._id}}$`
			if (!value.toString().match(new RegExp(regexp)))
				return `${name} (${value}) does not match id pattern`
			return false
		}
	},
}
