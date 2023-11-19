"use client";
import useCartStore from "@/store/cartStore";
import styles from "./index.module.scss";
import AmmountSelector from "../AmmountSelector";
import { Product } from "@/lib/DAL/Models";

type props = {
    className: string;
    _id: string;
};

export default function BuyButton({ className, _id }: typeof props) {
    const cachedItem = useCartStore((state) =>
        state.items.find((cacheItem) => cacheItem.product === _id),
    );
    const addItem = useCartStore((state) => state.addItem);
    if (!cachedItem) {
        return (
            <button
                type="button"
                className={`
                        ${className}
                        border-[2px] py-2 min-w-fit w-16 rounded-md font-bold text-xl 
                    `}
                onClick={() => addItem(_id)}
            >
                Buy
            </button>
        );
    } else {
        return <AmmountSelector {...cachedItem} />;
    }
}
