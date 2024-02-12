"use client"
import Image from 'next/image'
import React from 'react'
import { Checkbox } from '../checkbox'
import { Label } from '../label'


type Props<T extends string[]> = {
	className?: string
	value: T
	options: T|(()=>Promise<T>)
	id: string
	setValue: (value: T) => void
} & (
		| {
			view: "text"
		}
		| {
			view: "images"
			images: string[]
		}
	)
type TextCheckBoxProps = {
	id: string
	name: string
	value: boolean
	toggle: () => void
}

type ImageCheckBoxProps = {
	id: string
	name: string
	image: string
	value: boolean
	toggle: () => void
}


function TextCheckBox({ name, toggle, id, value }: TextCheckBoxProps) {
	const _id = React.useId()
	return (
		<Label htmlFor={_id} className='flex gap-2 hover:text-primary items-center text-inherit cursor-pointer'>
			<input
				type="checkbox"
				name={id}
				id={_id}
				checked={value}
				onChange={toggle}
			/>
			<span className='text-center text-inherit'>{name}</span>
		</Label>
	)
}
function ImageCheckBox({ name, image, value, toggle, id }: ImageCheckBoxProps) {
	const _id = `${name}-${image}`
	return (
		<div
			className='w-12 aspect-square p-1'
		>
			<input
				id={_id}
				name={id}
				hidden
				className='hidden peer'
				type="checkbox"
				checked={value}
				onChange={toggle}
			/>
			<Label
				htmlFor={_id}
				className={`
					peer-checked:opacity-100
					rounded-full overflow-hidden
					opacity-40 transition-opacity block relative w-full h-full
					cursor-pointer
				`}
			>
				<Image
					src={image}
					alt={name}
					fill
				/>
			</Label>
		</div>
	)
}

export default function CheckBoxBlock<T extends string[]>({
	value,
	id,
	options,
	setValue,
	className,
	...props
}: Props<T>) {
	return (
		<div
			className={`${className} p-2`}
		>
			{
				options.map((option) => {
					const toggle = () => {
						if (value.indexOf(option) !== -1)
							setValue(value.filter(val => val !== option))
						else
							setValue([...value, option])
					}
					return props.view === "text"
						?
						<TextCheckBox
							key={`${id}-${option}`}
							id={id}
							value={value.indexOf(option) !== -1}
							name={option}
							toggle={toggle}
						/>
						:
						<ImageCheckBox
							key={`${id}-${option}`}
							id={id}
							value={value.indexOf(option) !== -1}
							name={option}
							image={props.images[options.indexOf(option)]}
							toggle={toggle}
						/>

				})
			}
		</div>
	)
}
