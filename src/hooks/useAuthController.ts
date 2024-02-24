import React from "react"
import { useSession } from "next-auth/react"

export function useAuthController(action: () => void, options?: AuthOptions) {
	const session = useSession()
	const oldUser = React.useRef(session?.data?.user?.id)
	React.useEffect(() => {
		if (session.data?.user?.id === oldUser.current) return
		oldUser.current = session.data?.user?.id
		if (session.data?.user?.id || !options?.onUnAuth) action()
		else options?.onUnAuth?.()
	}, [session.data?.user?.id])
	return session
}
type AuthOptions = {
	onUnAuth?: () => void
}
