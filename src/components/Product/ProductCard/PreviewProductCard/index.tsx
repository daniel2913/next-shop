import Carousel from "../../../ui/Carousel";
import Price from "../../Price";
import Discount from "../../Discount";
import React from "react";

type props = {
    product: Omit<Product, "images" | "link"> & {
        images: File[] | null;
        brandImage: string;
    };
};

export default function PreviewProductCard({ product }: props) {
    const currentImageUrls = React.useRef<string[]>([]);
    currentImageUrls.current = React.useMemo(() => {
        for (const image of currentImageUrls.current) {
            URL.revokeObjectURL(image);
        }
        currentImageUrls.current = [];
        const res: string[] = [];
        if (!product.images) return res;
        for (const image of product.images) {
            res.push(URL.createObjectURL(image));
        }
        currentImageUrls.current.push(...res);
        return res;
    }, [product.images]);
    return (
        <div className="">
            <div className="">
                <Carousel>
                    {currentImageUrls.current.length > 0
                        ? currentImageUrls.current.map((img, i) => (
                            <img
                                width={230}
                                height={230}
                                key={img}
                                src={img}
                                alt={product.name}
                            />
                        ))
                        : [
                            <img
                                width={230}
                                key="template"
                                height={230}
                                src="/api/public/products/template.jpg"
                                alt={product.name}
                            />,
                        ]}
                </Carousel>
                <img
                    className=""
                    height={30}
                    width={30}
                    alt={`/api/public/brands/${product.brandImage}` || "unknown"}
                    src={`/api/public/brands/${product.brandImage}`}
                />
                <Discount discount={product.discount || 0} className="" />
            </div>
            <h3 className="">{product.name}</h3>
            <span className="">{product.brand}</span>
            <span className="">{product.category}</span>
            <Price
                className=""
                price={product.price || 200}
                discount={product.discount || 0}
            />
        </div>
    );
}
