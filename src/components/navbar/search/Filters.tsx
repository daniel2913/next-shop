import type React from "react";
import Image from "next/image";
import type { Brand, Category } from "@/lib/Models";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { ScrollArea } from "../../ui/ScrollArea";

type CategoryFilterProps = {
	allCategories: Category[];
	categories: string[];
	setCategories: React.Dispatch<React.SetStateAction<string[]>>;
	afterChange: ({ categoryCur }: { categoryCur: string[] }) => void;
};
export function CategoryFilter({
	categories,
	setCategories,
	afterChange,
	allCategories,
}: CategoryFilterProps) {
	return (
		<ToggleGroup
			className="flex w-1/2 flex-col justify-start gap-2"
			type="multiple"
			value={categories}
			onValueChange={(str: string[]) => {
				setCategories(str);
				afterChange({
					categoryCur: str,
				});
			}}
		>
			<span className="font-medium text-lg">Category</span>
			<ScrollArea className="h-[30dvh] w-full overflow-x-hidden">
				{allCategories.map((category) => (
					<ToggleGroupItem
						className="flex w-full justify-start gap-2"
						name="category"
						value={category.name}
						key={category.name}
					>
						<div className="relative flex-shrink-0 size-8 object-contain">
							<Image
								className="rounded-full"
								alt={category.name}
								src={`/categories/${category.images[0]}`}
								width={40}
								height={40}
							/>
						</div>
						{category.name}
						<input
							name="category"
							hidden
							readOnly
							value={category.name}
							checked={categories.includes(category.name)}
						/>
					</ToggleGroupItem>
				))}
			</ScrollArea>
		</ToggleGroup>
	);
}

type BrandFilterProps = {
	allBrands: Brand[];
	brands: string[];
	setBrands: React.Dispatch<React.SetStateAction<string[]>>;
	afterChange: ({ brandCur }: { brandCur: string[] }) => void;
};

export function BrandFilter({
	brands,
	setBrands,
	afterChange,
	allBrands,
}: BrandFilterProps) {
	return (
		<ToggleGroup
			className="flex w-1/2 flex-col justify-start gap-2"
			type="multiple"
			value={brands}
			onValueChange={(str: string[]) => {
				setBrands(str);
				afterChange({
					brandCur: str,
				});
			}}
		>
			<span className="font-medium text-lg">Brand</span>
			<ScrollArea className="h-[30dvh] w-full overflow-x-hidden">
				{allBrands.map((brand) => (
					<ToggleGroupItem
						className="flex w-full justify-start gap-2"
						name="brand"
						value={brand.name}
						key={brand.name}
					>
						<div className="relative shrink-0 size-8 object-contain">
							<Image
								className="rounded-full"
								alt={brand.name}
								src={`/brands/${brand.images[0]}`}
								width={40}
								height={40}
							/>
						</div>
						{brand.name}
						<input
							name="brand"
							hidden
							readOnly
							value={brand.name}
							checked={brands.includes(brand.name)}
						/>
					</ToggleGroupItem>
				))}
			</ScrollArea>
		</ToggleGroup>
	);
}
