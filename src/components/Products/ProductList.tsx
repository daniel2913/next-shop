"use client"

import useAction from "@/hooks/useAction"
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react"


export default function ProductList(){
	const products = useAction()
	return(
		<Tabs
			value="brand"
		>
			<TabsHeader>
				<Tab value="brand">
				</Tab>
				<Tab>
				</Tab>
			</TabsHeader>
			<TabsBody>
				<TabPanel value="category">
				</TabPanel>
				<TabPanel>
				</TabPanel>
			</TabsBody>
		</Tabs>
	)
}
