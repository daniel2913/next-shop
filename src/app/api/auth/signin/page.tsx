import AuthModule from "@/components/modals/Login"

type Props = {
	searchParams: Record<string,string>
}

export default function LoginPage({searchParams}:Props){
	const redirect = searchParams.redirect
	return(
		<div
			className="bg-background flex min-h-full justify-center items-center"
		>
		<AuthModule redirect={redirect||"localhost:3000/shop"}/>
		</div>
	)
}
