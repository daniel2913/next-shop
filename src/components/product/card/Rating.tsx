"use client";
import Star from "@public/star.svg";
import { useSession } from "next-auth/react";
import React from "react";
import { error } from "@/components/ui/use-toast";

type Props = {
	id: number;
	voters: number;
	rating: number;
	value: number;
	onChange: (val: number) => void;
	className: string;
	size?: number;
};

const ratings = [1, 2, 3, 4, 5];
const Rating = React.memo(function Rating({
	voters,
	value,
	onChange,
	rating,
	size = 30,
	className,
}: Props) {
	const session = useSession();
	async function handleRate(i: number) {
		if (session?.data?.user?.id) onChange(i);
		else {
			error({ error: "Only authorized users can rate products!", title: "Not Authorized" })
		}
	}
	return (
		<div
			className={`flex flex-nowrap justify-center gap-1 ${className}`}
			title={
				(rating > 0 &&
					`
				${rating} from ${voters} voter${voters % 10 === 1 ? "" : "s"}`) ||
				"No Votes"
			}
		>
			{ratings.map((i) => (
				<button
					disabled={value === -1}
					type="button"
					aria-label={`rate this product ${i}`}
					key={`${i}`}
					onClick={() => handleRate(i)}
				>
					<Star
						width={size}
						height={size}
						className={` aspect-square
								${value === 0
								? "stroke-accent"
								: i <= rating
									? "stroke-foreground"
									: "stroke-secondary"
							}
								${(i <= value && "fill-accent") ||
							(i <= rating && "fill-foreground") ||
							"fill-secondary"
							}
							`}
					/>
				</button>
			))}
		</div>
	);
});

export default Rating;
