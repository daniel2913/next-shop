"use client";
import { useSession } from "next-auth/react";
import React from "react";
import Account from "@public/account.svg";
import dynamic from "next/dynamic";
import NavButton from "../../ui/Navbutton";
import { LocalModal } from "@/components/modals/Base";
import useResponsive from "@/hooks/useResponsive";

const Login = dynamic(() => import("@/components/modals/auth"));

type Props = {
	children: React.ReactNode;
	className: string;
};

export default function AuthContainer({ children, className }: Props) {
	const [isOpen, setIsOpen] = React.useState(false)
	const mode = useResponsive()
	const session = useSession();
	if (!session.data?.user?.name)
		return (
			<>
				<NavButton
					onClick={() => setIsOpen(true)}
					aria-label="open authentication form"
					className={className}
				>
					<Account
						className="*:stroke-foreground *:stroke-1"
						width={"22px"}
						height={"22px"}
					/>
					Sign In
				</NavButton>
				{isOpen && <LocalModal close={() => setIsOpen(false)} isOpen={isOpen}>
					<Login close={() => setIsOpen(false)} />
				</LocalModal>
				}
			</>
		);
	return (
		<>
			{isOpen &&
				<div
					onClick={() => setIsOpen(v => !v)}
					className="fixed inset-0 bg-transparent" />
			}
			<div className="relative h-full">
				<NavButton
					className={`${className}`}
					aria-label="open account specific actions"
					onClick={() => setIsOpen(v => !v)}
				>
					<Account
						className="*:stroke-foreground *:stroke-2"
						width={"22px"}
						height={"22px"}
					/>
					Account
				</NavButton>
				{isOpen && <Popover close={() => setIsOpen(false)} offset={mode === "desktop" ? 40 : -60}>
					{children}
				</Popover>
				}
			</div>
		</>
	);
}

type PopoverProps = {
	children: React.ReactNode
	offset: number
	close: () => void
}
function Popover(props: PopoverProps) {
	const ref = React.useRef<HTMLDivElement>(null)
	const done = React.useRef(false)
	done.current = false
	React.useLayoutEffect(() => {
		if (done.current || !ref.current) return
		done.current = true
		const el = ref.current
		if (!el) return
		const rect = el?.getBoundingClientRect()

		if (rect.left < 0) el.style.left = "0px"
		else if (rect.right > window.innerWidth) el.style.right = "0px"

		if (rect.top + props.offset < 0) el.style.top = `${-props.offset}px`
		else if (rect.bottom + props.offset > window.innerHeight) el.style.bottom = `${-props.offset}px`
		else el.style.top = `${props.offset}px`

	})
	return (
		<div onClick={props.close} ref={ref} className="absolute w-fit bg-secondary border-2 border-black rounded-lg">
			{props.children}
		</div>
	)
}
