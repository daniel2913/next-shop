import React, { FormEvent } from "react";
import LabeledInput from "@/components/ui/LabeledInput";

export type FormFieldValue = string | File[];
export interface FormFieldValidator {
	(
		v: FormFieldValue,
	): string | false;
}
export type FormFieldProps = Omit<
	React.ComponentProps<typeof LabeledInput>,
	"value" | "setValue"
>;





type Props<T extends Record<string, FormFieldValue>> = {
	className: string;
	fieldValues: T;
	setFieldValues: React.Dispatch<React.SetStateAction<T>>;
	fieldProps: { [Key in keyof T]: FormFieldProps };
	action: string;
	children?: React.ReactNode;
} & (
		| {
			method: "PUT" | "POST";
		}
		| {
			method: "PATCH";
			targId: string;
		}
	);

export default function Form<T extends Record<string, FormFieldValue>>({
	fieldValues,
	setFieldValues,
	fieldProps,
	className,
	action,
	method,
	...params
}: Props<T>) {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");
	const [status, setStatus] = React.useState("");

	async function submitHandler(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData();
		setError("");
		setStatus("");
		for (const [key, value] of Object.entries(fieldValues)) {

			if (!Array.isArray(value)) {
				if (fieldProps[key].validator) {
					const entryValid = fieldProps[key].validator(value);
					if (!entryValid.valid) {
						setError(`${fieldProps[key].label}: ${entryValid.msg}`);
						return false;
					}
				}
				form.append(key, value)
			}

			else if (Array.isArray(value)) {
				if (fieldProps[key].validator) {
					const entryValid = fieldProps[key].validator(value);
					if (!entryValid) {
						setError(`${fieldProps[key].label} is invalid`);
						return false;
					}
				}
				for (const item of value) {
					form.append(key, item);
				}
			}
		}
		setLoading(true);
		const res = await fetch(action, {
			method: method,
			body: form,
		});
		setLoading(false);
		const code = (res.status / 100) ^ 0;
		if (code === 2) setStatus("Successful!");
		else if (code === 4) setError(`Input error! ${res.text}`);
		else if (code === 5) setError(`Server Error! ${res.text}`);
		else setStatus("Something strange happened!");
		return true;
	}

	return (
		<div className={`${className} flex`}>
			<form className="flex flex-col gap-3" onSubmit={submitHandler}>
				{Object.entries(fieldProps).map(([key, props]) => (
					<LabeledInput
						key={key}
						value={fieldValues[key]}
						setValue={(
							value: FormFieldValue | ((a: FormFieldValue) => FormFieldValue),
						) => {
							if (value instanceof Function) {
								setFieldValues((prev) => ({
									...prev,
									[key]: value(prev[key]),
								}));
							} else {
								setFieldValues((prev) => ({ ...prev, [key]: value }));
							}
						}}
						{...props}
					/>
				))}
				{loading ? (
					<button disabled={true} type="submit">
						Loading...
					</button>
				) : (
					<button type="submit">Save</button>
				)}
				<span>{error}</span>
				<span>{status}</span>
			</form>
			{params.children}
		</div>
	);
}
