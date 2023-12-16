"use client"
import Image from 'next/image'
import React from 'react'


type Props<T extends string[]> = {
	className?: string
	value:T[number][]
	options: T
	id:string
	setValue: (value:T[number][]) => void
}&(
|{
	view:"text"
}
|{
	view:"images"
	images:string[]
}
)
type TextCheckBoxProps = {
	id:string
	name:string
	value:boolean
	toggle: () => void
}

type ImageCheckBoxProps = {
	id:string
	name:string
	image:string
	value:boolean
	toggle: () => void
}


function TextCheckBox({name,toggle,id,value }: TextCheckBoxProps) {
	return (
		<div>
			<input
				name={id}
				type="checkbox"
				checked={value}
				value={name}
				onChange={toggle}
			/>
		</div>
	)
}
function ImageCheckBox({ name,image,value,toggle,id}: ImageCheckBoxProps) {
	const _id = `${name}-${image}`
	return (
		<div
			className='w-12 aspect-square p-1'
		>
			<input
				id={_id}
				name={id}
				className='hidden peer'
				type="checkbox"
				checked={value}
				onChange={toggle}
			/>
			<label
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
			</label>
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
						if(value.indexOf(option)!==-1)
							setValue(value.filter(val=>val!==option))
						else
							setValue([...value,option])
					}
					return props.view === "text"
						? 
						<TextCheckBox
							key={`${id}-${option}`}
							id={id}
							value={value.indexOf(option)!==-1}
							name={option}
							toggle={toggle}
						/>
						:
							<ImageCheckBox
							key={`${id}-${option}`}
							id={id}
							value={value.indexOf(option)!==-1}
							name={option}
							image={props.images[options.indexOf(option)]}
							toggle={toggle}
							/>
					
				})
			}
		</div>
	)
}
