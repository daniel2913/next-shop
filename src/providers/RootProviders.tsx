"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ResponsiveProvider } from "./ResponsiveProvider";
import type { RootState } from "@/store/rtk";
import GlobalModalProvider from "./ModalProvider";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "./StoreProvider";

type SessionProps = {
	session: Session | null;
	children: React.ReactNode;
	initProps: RootState
};

export default function RootProviders(props: SessionProps) {
	return (
		<SessionProvider refetchOnWindowFocus={false} session={props.session}>
			<StoreProvider initProps={props.initProps}>
				<ResponsiveProvider>
					<GlobalModalProvider>
						{props.children}
						<Toaster />
					</GlobalModalProvider>
				</ResponsiveProvider>
			</StoreProvider>
		</SessionProvider>
	);
}

