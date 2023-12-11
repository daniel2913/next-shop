"use client"
import Image from 'next/image'
import React from 'react'


type Options<T extends "text"|"images"> = {
	[i:string]:{
		value:boolean
	}
	&
	T extends "images"
	?
		{
			value:boolean
			image:string
		}
	: 
		{
			value:boolean
		}
		
}

type Props<U extends "text"|"images",T extends Options<U>> = {
	className?: string
	value: T
	setValue: (id: keyof T) => void
	type:U
}
	/* &
	(
		{
			type: "images
			images:never
		}
		|
		{
			type: "images",
			images: Map<keyof T, string>
		}
	) */

type TextCheckBoxProps = {
	name:string
	option: Options<"text">[string]
	toggle: () => void
}

type ImageCheckBoxProps = {
	name:string
	option: Options<"images">[string]
	toggle: () => void
}


function TextCheckBox({name, option,toggle }: TextCheckBoxProps) {
	return (
		<div>
			<input
				type="checkbox"
				checked={option.value}
				value={name}
				onChange={toggle}
			/>
		</div>
	)
}
function ImageCheckBox({ name,option,toggle}: ImageCheckBoxProps) {
	const id = `${name}-${option.image}`
	return (
		<div
			className='w-12 aspect-square p-1'
		>
			<input
				id={id}
				className='hidden peer'
				type="checkbox"
				checked={option.value}
				onChange={toggle}
			/>
			<label
				htmlFor={id}
				className={`
					peer-checked:opacity-100
					rounded-full overflow-hidden
					opacity-40 transition-opacity block relative w-full h-full
					cursor-pointer
				`}
			>
				<Image
					src={option.image}
					alt={name}
					fill
				/>
			</label>
		</div>
	)
}

export default function CheckBoxBlock<U extends "text"|"images",T extends Options<U>>({
	value,
	setValue,
	type,
	className
}: Props<U,T>) {
	return (
		<div
			className={`${className} p-2`}
		>
			{
				Object.keys(value).map((key) => {
					const toggle = () => setValue(key)
					const CheckBox = type === "images"
						? ImageCheckBox
						: TextCheckBox
					return (
						<CheckBox
							key={key}
							option={value[key]}
							name={key}
							toggle={toggle}
						/>
					)
				})
			}
		</div>
	)
}
