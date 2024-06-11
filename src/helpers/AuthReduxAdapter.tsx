"use client"
import { actions, useAppDispatch } from "@/store/rtk";
import { useSession } from "next-auth/react";
import React from "react";

export default function AuthReduxAdapter() {
	const dispatch = useAppDispatch()
	const session = useSession()
	const oldUser = React.useRef(session.data?.user?.id)
	React.useEffect(() => {
		if (session.data?.user?.id === oldUser.current) return
		oldUser.current = session.data?.user?.id
		dispatch(actions.auth.setUser({ id: session.data?.user?.id, role: session.data?.user?.role }))

	}, [session.data?.user?.id])
	return null
}
