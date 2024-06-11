"use client";
import { Button } from "@/components/ui/Button";
import { actions, useAppDispatch } from "@/store/rtk";
import { useRouter } from "next/navigation";

type Props = {
	className?: string;
};

export default function ClearSaved(props: Props) {
	const router = useRouter();
	const dispatch = useAppDispatch()

	return (
		<Button
			className={`${props.className} font-bold fixed left-4 top-4 z-10 md:top-14`}
			onClick={async () => {
				router.push("/shop/home");
				dispatch(actions.saved.clearSaved())
			}}
		>
			Clear Saved
		</Button>
	);
}
