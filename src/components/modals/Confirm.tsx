import { Button } from "../ui/Button";
export default function ModalConfirm(props: {
	message: string;
	resolver: (ans: boolean) => void;
}) {
	return (
		<div>
			<p className="mb-4 text-lg font-medium">{props.message}</p>
			<div className="flex justify-center gap-16">
				<Button
					onClick={() => {
						props.resolver(true);
					}}
				>
					Yes
				</Button>
				<Button onClick={() => props.resolver(false)}>No</Button>
			</div>
		</div>
	);
}
