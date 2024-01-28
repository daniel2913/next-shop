"use client"
import { useRouter } from "next/navigation"
import React from "react"

type Props = {
	expires: Date
	hide:()=>void
}

export default function Timer({ expires,hide }: Props) {
	const [timeLeft, setTimeLeft] = React.useState(0)
	if (timeLeft<=0) hide()
	React.useEffect(() => {
		const timer = setTimeout(
			() => setTimeLeft(Math.max(+expires - Date.now(), 0)),
			1000
		)
		return () => clearTimeout(timer)
	})
	const gtime = new Date(timeLeft)
	const time = new Date(+gtime + gtime.getTimezoneOffset() * 1000 * 60)
	return (
		<span className="text-center text-[.75em] text-gray-500">
			{`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}
		</span>
	)
}
