import { Button } from "@/components/ui/Button"
import {Meta, StoryObj} from "@storybook/react"


const meta:Meta = {
	title:"Button/default",
	tags:['autodocs'],
	component:Button
}

export default meta

type Story = StoryObj<typeof Button>

export const Base:Story = {
	args:{
		children:"Button"
	}
}
