import Link from "next/link";
import styles from "./index.module.scss";

import React from "react";
import Auth from "../ui/Auth";
import CartStatus from "../cart/Status";
import Search from "../ui/Search";
import { BrandModel, CategoryModel } from "@/lib/DAL/Models";

export const revalidate = 300;

export default async function NavBar() {
    const [brands, categories] = await Promise.all([
        BrandModel.find(undefined),
        CategoryModel.find(undefined),
    ]);
    return (
        <header
            className="
            relative top-0 left-0 right-0
            h-12 py-2 px-5
            flex justify-between
            bg-blue-300"
        >
            <div className="w-20 h-15 bg-red-300"></div>
            <Search brandList={brands} categoryList={categories} />
            <div className={styles["login"]}>
                <CartStatus />
                <Auth />
            </div>
        </header>
    );
}
