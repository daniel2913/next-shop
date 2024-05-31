import type React from "react";

type HeaderProps = {
	className?: string;
	children: React.ReactNode;
};

export default function Header(props: HeaderProps) {
	return <header className={props.className}>{props.children}</header>;
}
