import AuthModule from "@/components/modals/auth"
import {Meta, StoryObj} from "@storybook/react"

const meta:Meta = {
	title:"Auth/default",
	tags:['autodocs'],
	component:AuthModule
}

export default meta

type Story = StoryObj<typeof AuthModule>

export const Base:Story = {
	render:()=><AuthModule/>
	
}

