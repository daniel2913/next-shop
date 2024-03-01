import React from "react"
import {SessionProvider} from "next-auth/react"
import { ResponsiveProvider } from "@/providers/ResponsiveProvider"


export function Providers(Story,{parameters}){
	return(
		<ResponsiveProvider>
				<Story {...parameters}/>
		</ResponsiveProvider>
	)
}
