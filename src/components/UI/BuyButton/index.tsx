"use client";
import useCartStore from "@/store/cartStore";
import AmmountSelector from "../AmmountSelector";

interface Props {
    className: string;
    _id: string;
};

export default function BuyButton({ className, _id }: Props) {
    const cachedItem = useCartStore((state) =>
        state.items.find((cacheItem) => cacheItem.product === _id),
    );
    const addItem = useCartStore((state) => state.addItem);
    if (cachedItem) {
        return <AmmountSelector className={`${className}`} {...cachedItem} />;
    } else {
        return (
            <button
                type="button"
                className={`
                        ${className}
                        border-2 uppercase border-accent1-200 py-2 min-w-fit w-16 rounded-md font-bold text-xl 
                    `}
                onClick={() => addItem(_id)}
            >
                Buy
            </button>
        );
    }
}
