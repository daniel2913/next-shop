"use client";
import useModalStore from "@/store/modalStore";

import React from "react";

export default function ModalBase() {
    const { isVisible, content, close } = useModalStore((state) => state.base);
    return (
        <dialog className="">
            <button onClick={close} className="">
                X
            </button>
            {content}
        </dialog>
    );
}
