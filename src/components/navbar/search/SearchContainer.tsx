"use client"

import useResponsive from "@/hooks/useResponsive"
import React from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/Drawer"
import Glass from "@public/search.svg"

type Props = {
	children:React.ReactNode
	className?:string
}

export default function SearchContainer({children,className}:Props){
	const mode = useResponsive()
	const [drawerOpen, setDrawerOpen] = React.useState(false)
	return(
		mode === "desktop"
			?	<div className={className}>{children}</div>
			:	
				<Drawer onOpenChange={setDrawerOpen} open={drawerOpen}>
					<DrawerTrigger  onClick={()=>setDrawerOpen(true)} className={`${className} flex flex-auto flex-col items-center`} >
						<Glass width="30px" height="30px" className="bg-tan opacity-80 rounded-full"/>
						Search
					</DrawerTrigger>
					<DrawerContent onSubmit={()=>setDrawerOpen(false)} className="w-full border-x-0 pb-14 h-dvh bg-secondary items-start">
						{children}
					</DrawerContent>
				</Drawer>
	)
}
