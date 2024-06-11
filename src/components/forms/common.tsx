" use client";
import React, { FormEvent } from "react";
import { Button } from "../ui/Button";
import type { ServerErrorType } from "@/hooks/useAction";
import { isValidResponse, toArray } from "@/helpers/misc";
import { error, toast } from "../ui/use-toast";

export const clientValidations = {
	name: (value: FormFieldValue) => {
		if (typeof value !== "string") return "Name can only be string!";

		return value.length === 0 ? "Name Required!" : false;
	},
	images: (valueIn: File[] | File | string | null, required = false) => {
		if (typeof valueIn === "string") return false
		if (!valueIn) return required ? "Image required" : false;
		const value = toArray(valueIn);
		if (value.length === 0) return false;
		for (const file of value) {
			if (file.size === 0) continue;
			const ext = file.type;
			if (ext !== "image/jpeg" && ext !== "image/jpg") return `Only jpegs!`;
			if (file.size > 1024 * 512) return "Only under 0.5MB!";
		}
		return false;
	},
	description: (value: FormFieldValue) => {
		if (typeof value !== "string") return "Description can only be string!";
		return value.length === 0 ? "Description required" : false;
	},
};

export type Props = {
	className: string;
	validations: Record<string, (val: any) => false | string>;
	action: (payload: FormData) => Promise< false | ServerErrorType>;
	children: React.ReactNode;
	preview?: React.ReactElement;
};
export type FormFieldValue = string | File[] | string[];
export type FormFieldValidator = (v: FormFieldValue) => string | false;

export default function Form({
	preview,
	validations,
	className,
	children,
	action,
}: Props) {
	const [loading, setLoading] = React.useState(false);

	async function submitHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const payload = new FormData(e.currentTarget);
		const req = new FormData()
		for (const [key, value] of payload.entries()) {
			if (value instanceof File && value.size === 0) continue
			if (validations[key]) {
				const entryInvalid = validations[key](value);
				if (entryInvalid) {
					e.stopPropagation()
					error({ error: entryInvalid, title: `${key} validation` });
					return;
				}
			}
			req.append(key, value);
		}
		setLoading(true);
		const res = await action(req);
		if (isValidResponse(res)) toast({ description: "Form accepted", title: "Successful" })
		else error(res)
		setLoading(false);
	}

	return (
		<div className={`${className} p-2 flex items-center min-w-[45rem] justify-between gap-4`}>
			<form onSubmit={submitHandler} className="flex w-1/2 flex-col gap-3 ">
				{children}
				<Button disabled={loading} type="submit">
					{loading ? "Loading..." : "Send"}
				</Button>
			</form>
			{preview || null}
		</div>
	);
}
