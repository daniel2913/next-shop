import {Meta, StoryObj} from "@storybook/react"
import Cart from "@/components/cart"
import { PopulatedProduct } from "@/lib/Models/Product"


const testProd: PopulatedProduct[] = new Array(20).map((_,idx)=>({
		id:idx,
		voters:50,
		rating:3,
		name:"Test",
		description:"This is test",
		images:["template.jpg","template.jpg","template.jpg","template.jpg"],
		price:220,
		discount:20,
		brand:{
			id:1,
			name:"Test",
			image:"template.jpg"
		},
		category:{
			id:1,
			name:"Test",
			image:"template.jpg"
		}
}))

const meta:Meta = {
	title:"Auth/default",
	tags:['autodocs'],
	component:Cart
}

export default meta

type Story = StoryObj<typeof Cart>

export const Base:Story = {
	parameters:{
	},
	render:()=><Cart initCart={{}} products={testProd}/>
}


