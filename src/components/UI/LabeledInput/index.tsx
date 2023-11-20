"use client";
import { FormFieldValidator, FormFieldValue } from "@/components/forms";
import React from "react";
import ImagesPreview from "../ImagesPreview";
import Selector from "../Selector";

type props = {
    label?: string;
    placeholder?: string;
    className?: string;
    id: string;
    accept?: string;
    validator?: FormFieldValidator;
    //type: T
    //value: T extends 'file' ? File[] : string
    //setValue: value
} & (
        | {
            type: "text" | "password";
            multiple?: false;
            options?: never[];
            value: string;
            setValue: (val: string) => void;
        }
        | {
            type: "file";
            multiple?: boolean;
            options?: never[];
            value: File[];
            setValue: (val: File[]) => void;
        }
        | {
            type: "select";
            multiple?: false;
            options: string[];
            value: string;
            setValue: (val: string) => void;
        }
    );

function fileListAdapter(inp: File | FileList | null): File[] {
    if (!inp) return [] as File[];
    if (inp instanceof File) return [inp];
    return Array.from(inp);
}

export default function LabeledInput({
    label = "default label",
    multiple = false,
    accept = "image/*",
    placeholder = "input",
    type,
    className = "",
    options = [],
    id,
    value,
    setValue,
    validator: validation,
}: props) {
    type = type ? type : "text";
    const [_error, _setError] = React.useState<string>("");
    const _inpRef = React.useRef<HTMLInputElement>(null);
    function validate(value: props["value"], validation: props["validator"]) {
        if (validation) {
            const err = validation(value);
            if (!err.valid) {
                _setError(err.msg);
                return false;
            } else {
                _setError("");
                return true;
            }
        }
    }
    function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        value;
        setValue;
        if (type === "file") {
            value;
            setValue;
            const files = fileListAdapter(e.currentTarget.files);
            if (validate(files, validation)) {
                setValue(files);
            }
        } else {
            setValue(e.currentTarget.value);
        }
    }

    React.useEffect(() => {
        if (type != "file" || !value || !_inpRef.current) {
            return;
        }
        const data = new DataTransfer();
        for (const file of value) {
            data.items.add(file as File);
        }
        _inpRef.current.files = data.files;
    }, [value, multiple, type]);
    const preview =
        type === "file" ? (
            <ImagesPreview
                images={value as File[]}
                delImage={(idx: number) => {
                    setValue(value.filter((_, idxOld) => idx != idxOld));
                }}
            />
        ) : (
            <></>
        );
    return type === "select" ? (
        <Selector
            value={value as string}
            setValue={setValue}
            options={options}
            id={id}
            label={label}
        />
    ) : (
        <div className={`${className}`}>
            <label htmlFor={id || ""} className="">
                {label}
            </label>
            <input
                ref={_inpRef}
                multiple={multiple}
                accept={accept}
                onBlur={() => validate(value, validation)}
                id={id}
                name={id}
                className=""
                type={type}
                placeholder={placeholder}
                value={typeof value === "string" ? value : ""}
                onChange={changeHandler}
            />
            <label htmlFor={id || ""} className="">
                {_error}
            </label>
            {preview}
        </div>
    );
}
