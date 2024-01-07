"use client"

import OrderList from "./index"
import React from "react"

export default function WrappedOrderList(){
	return(
	<>
			<OrderList completed={true}/>
	</>
	)
}
