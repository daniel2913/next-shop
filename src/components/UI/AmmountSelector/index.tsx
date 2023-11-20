"use client";
import React from "react";
import useConfirm from "@/hooks/modals/useConfirm";
import useCartStore from "@/store/cartStore";

export default function AmmountSelector(item: {
    product: string;
    amount: number;
}) {
    const confirm = useConfirm("Are you sure you want to discard this item?");
    const amount = useCartStore(
        (state) =>
            state.items.find((state) => state.product === item.product)?.amount || 0,
    );
    const itemDiscarder = useCartStore((state) => state.discardItem);
    const ammountSetter = useCartStore((state) => state.setAmmount);
    const discardItem = () => itemDiscarder(item.product.toString());
    const setAmmount = (amnt: number) =>
        ammountSetter(item.product.toString(), amnt);
    function clickHandler(newAmount: number) {
        if (newAmount <= 0) {
            confirm().then((ans) => {
                return ans ? discardItem() : false;
            });
        } else setAmmount(newAmount);
    }
    return (
        <div className={""}>
            <div className="">
                <button
                    type="button"
                    className=""
                    onClick={() => clickHandler(amount + 1)}
                >
                    +
                </button>
                <span className="" />
                <button
                    type="button"
                    className=""
                    onClick={() => clickHandler(amount - 1)}
                >
                    -
                </button>
            </div>
        </div>
    );
}
