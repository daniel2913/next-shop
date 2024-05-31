" use client";
import React from "react";
import { Button } from "../ui/Button";
import type { ServerErrorType } from "@/hooks/useAction";
import { toArray } from "@/helpers/misc";
import { useToastStore } from "@/store/ToastStore";
export const clientValidations = {
	name: (value: FormFieldValue) => {
		if (typeof value !== "string") return "Name can only be string!";

		return value.length === 0 ? "Name Required!" : false;
	},
	images: (valueIn: File[] | File | null) => {
		if (!valueIn) return false;
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
	action: (payload: FormData) => Promise<false | ServerErrorType>;
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
	const isValidResponse = useToastStore((s) => s.isValidResponse);
	const showError = useToastStore((s) => s.error);
	const showStatus = useToastStore((s) => s.info);

	async function submitHandler(e: FormData) {
		const payload = new FormData();
		for (const [key, value] of e.entries()) {
			if (validations[key]) {
				const entryInvalid = validations[key](value);
				if (entryInvalid) {
					showError(entryInvalid, `${key} validation`);
					return;
				}
			}
			payload.append(key, value);
		}
		setLoading(true);
		const res = await action(payload);
		if (isValidResponse(res)) showStatus("Successful");
		setLoading(false);
	}

	return (
		<div className={`${className} flex items-center justify-center gap-4`}>
			<form action={submitHandler} className="flex flex-col gap-3 ">
				{children}
				<Button disabled={loading} type="submit">
					{loading ? "Loading..." : "Send"}
				</Button>
			</form>
			{preview || null}
		</div>
	);
}
