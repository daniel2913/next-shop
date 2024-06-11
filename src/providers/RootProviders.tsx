"use client";

import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { ResponsiveProvider } from "./ResponsiveProvider";
import { Provider } from "react-redux";
import { makeStore } from "@/store/rtk";
import { getInitState } from "@/actions/user";
import GlobalModalProvider from "./ModalProvider";
import { Toaster } from "@/components/ui/toaster";

type SessionProps = {
	session: Session | null;
	children: React.ReactNode;
	initProps: Parameters<typeof makeStore>[0]
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

type StoreProps = {
	children: React.ReactNode;
	initProps: Parameters<typeof makeStore>[0]
}

function StoreProvider(props: StoreProps) {
	const session = useSession()
	const oldId = React.useRef(session.data?.user?.id)
	const [store, setStore] = React.useState(() => makeStore(props.initProps))
	React.useEffect(() => {
		if (oldId.current === session.data?.user?.id) return
		oldId.current = session.data?.user?.id
		getInitState().then(state => {
			setStore(makeStore(state))
		})
	}, [session.data?.user?.id])
	return (
		<Provider store={store}>
			{props.children}
		</Provider>
	)
}
