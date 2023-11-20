import LabeledInput from "@/components/ui/LabeledInput";
import { ComponentProps, FormEvent, useRef, useState } from "react";
import useError from "@/hooks/modals/useError";

export type FormFieldValue = string | File[] | null;
export type FormFieldValidator = (
    v: FormFieldValue,
) => { valid: true; msg?: string } | { valid: false; msg: string };
export type FormFieldProps = Omit<
    ComponentProps<typeof LabeledInput>,
    "value" | "setValue"
>;

type props<T extends { [key: string]: FormFieldValue }> = {
    fieldValues: T;
    setFieldValues: React.Dispatch<React.SetStateAction<T>>;
    fieldProps: { [key in keyof T]: FormFieldProps };
    action: string;
} & (
        | {
            method: "PUT";
        }
        | {
            method: "PATCH";
            targId?: string;
            targName?: string;
        }
    );

export default function Form<T extends { [key: string]: string | null }>({
    fieldValues,
    setFieldValues,
    fieldProps,
    ...params
}: props<T>) {
    const [loading, setLoading] = useState(false);
    const error = useError();
    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData();
        let valid = true;
        for (const [key, value] of Object.entries(fieldValues) as [
            keyof T,
            FormDataEntryValue,
        ][]) {
            if (fieldProps[key].validator) {
                const entryValid = fieldProps[key].validator!(value);
                if (!entryValid.valid) {
                    valid = false;
                    break;
                }
            }
            if (value instanceof File || typeof value != "object") {
                form.append(key.toString(), value);
            } else {
                for (const idx in value) {
                    form.append(key.toString(), value[idx]);
                }
            }
        }
        if (!valid) {
            return false;
        }
        setLoading(true);
        const result = await fetch(params.action, {
            method: params.method,
            body: form,
        });
        setLoading(false);
        error(await result.text());
    }

    return (
        <form onSubmit={submitHandler}>
            {Object.entries(fieldProps).map(([key, props]) => (
                <LabeledInput
                    key={key}
                    value={fieldValues[key as keyof typeof fieldProps]}
                    setValue={(val: FormFieldValue) =>
                        setFieldValues({ ...fieldValues, [key]: val })
                    }
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
        </form>
    );
}
