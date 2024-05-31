"use client";
import Exit from "@public/exit.svg";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Admin from "@public/admin.svg";
import Heart from "@public/heart.svg";
import OrderMenu from "../Orders";

type Props = {
	className?: string;
};

export function ReloadOnUserChange() {
	const router = useRouter();
	const session = useSession();
	React.useEffect(() => {
		router.refresh();
	}, [session]);
	return null;
}

export default function Auth({ className }: Props) {
	const session = useSession();
	return (
		<div
			className={`${className} flex flex-col items-center gap-2 md:flex-row`}
		>
			{session.data?.user?.role === "admin" ? (
				<Link className="appearence-none" href={"/admin/orders"}>
					<Button
						className="flex h-full flex-col p-1"
						type="button"
						variant="link"
					>
						<Admin
							className="*:fill-accent *:stroke-foreground"
							width="30px"
							height="30px"
						/>
						Admin Panel
					</Button>
				</Link>
			) : (
				<>
					<OrderMenu className="flex h-full flex-col gap-0 p-1 underline-offset-4 hover:underline" />
					<Link className="appearence-none h-fit w-fit" href={"/shop/saved"}>
						<Button
							className="flex h-full flex-col p-1"
							type="button"
							variant="link"
						>
							<Heart
								width="30px"
								height="30px"
								className={`fill-accent *:stroke-card-foreground *:stroke-1`}
							/>
							Saved
						</Button>
					</Link>
				</>
			)}
			<Button
				className="flex h-full basis-0 flex-col bg-transparent p-1 text-foreground underline-offset-4 hover:bg-transparent hover:underline"
				type="submit"
				onClick={() => {
					signOut({ redirect: false });
				}}
			>
				<Exit
					className=" *:fill-accent *:stroke-accent"
					height="30px"
					width="30px"
				/>
				Sign Out
			</Button>
		</div>
	);
}
