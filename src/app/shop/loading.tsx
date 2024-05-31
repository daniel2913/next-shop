import Spinner from "@public/loading.svg";
export default function Loading() {
	return (
		<main className="size-full pr-[var(--removed-body-scroll-bar-size)]">
			<div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
				<Spinner
					className="animate-spin *:stroke-foreground"
					width={50}
					height={50}
				/>
			</div>
		</main>
	);
}
