"use client";
import useResponsive from "@/hooks/useResponsive";
import { useSession } from "next-auth/react";
import React from "react";
import Account from "@public/account.svg";
import dynamic from "next/dynamic";
import NavButton from "../../ui/Navbutton";
import { LocalModal } from "@/components/modals/Base";

const Login = dynamic(() => import("@/components/modals/auth"));

type Props = {
	children: React.ReactNode;
	className: string;
};

export default function AuthContainer({ children, className }: Props) {
	const mode = useResponsive();
	const [isOpen, setIsOpen] = React.useState(false)
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
						className="*:stroke-foreground *:stroke-2"
						width={"30px"}
						height={"30px"}
					/>
					Log In
				</NavButton>
				{{ isOpen } && <LocalModal title="Authentication" close={() => setIsOpen(false)} isOpen={isOpen}>
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
			<div className="relative">
				<NavButton
					className={`${className}`}
					aria-label="open account specific actions"
					onClick={() => setIsOpen(v => !v)}
				>
					<Account
						className="*:stroke-foreground *:stroke-2"
						width={"30px"}
						height={"30px"}
					/>
					Account
				</NavButton>
				{isOpen && <Popover offset={40}>
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
		if (rect.left < 0) {
			el.style.left = "0px"
		} else if (rect.right > window.innerWidth) {
			el.style.right = "0px"
		}
	})
	return (
		<div style={{ top: `${props.offset}px` }} ref={ref} className="absolute w-fit bg-secondary border-2 border-black rounded-lg">
			{props.children}
		</div>
	)
}

/* <div
className="absolute items-center bg-secondary rounded-lg p-1 bottom-14 md:-bottom-24 border-2 border-black flex w-full flex-col gap-2 md:right-[calc(15vw_-_100%)] md:w-fit md:flex-row"
>
{children}
</div>
} */
