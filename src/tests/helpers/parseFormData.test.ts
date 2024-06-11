import { parseFormData } from "@/helpers/misc"

function makeForm(obj: Record<string, string | File | (string | File)[]>) {
	const form = new FormData()
	for (const key in obj) {
		const val = obj[key]
		if (Array.isArray(val)) {
			for (const item of val)
				form.append(key, item instanceof File ? item : item.toString())
		} else {
			form.append(key, val instanceof File ? val : val.toString())
		}
	}
	return form
}


it.each([
	[{}],
	[{ name: "", age: "0" }],
	[{ name: "John", age: "30" }],
	[{ name: ["John", "Mark"], age: ["30", "26"] }],
	[{ name: ["John", "John"] }],
	[{ file: new File([], "test") }],
	[{ files: [new File([], "test"), new File([], "test")] }],
])("Correctly parses FormData", (a) => {
	expect(parseFormData(a instanceof FormData ? a : makeForm(a))).toEqual(a)
})
