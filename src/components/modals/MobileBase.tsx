"use client";

import React from "react";
import { Drawer, DrawerContent, DrawerPortal, DrawerTitle } from "../ui/Drawer";

type Props = {
	isOpen: boolean
	children: React.ReactNode
	onClose?: () => void
	close: () => void
}
export default function MobileModal(props: Props) {
	return (
		<Drawer
			open={props.isOpen}
			onClose={() => {
				props.onClose?.()
				props.close()
			}}
		>
			<DrawerPortal>
				<DrawerTitle className="text-center text-2xl font-bold capitalize">
				</DrawerTitle>
				<DrawerContent
					onSubmit={() => {
						props.close();
					}}
					className="flex h-dvh w-full content-start items-center border-x-0 bg-background px-4 pb-10 "
				>
					{props.children}
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	);
}
