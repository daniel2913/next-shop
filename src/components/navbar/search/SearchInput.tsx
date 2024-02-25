"use client"
import React from "react"
import SearchIcon from "@/../public/search.svg"
import Input from "../../ui/Input"
import useResponsive from "@/hooks/useResponsive"

type SearchInputProps = {
	name: string
	setName: (val: string) => void
	afterChange: ({ nameCur }: { nameCur: string }) => void
}
export function SearchInput({ name, setName, afterChange }: SearchInputProps) {
	const mode = useResponsive()
	return (
		<div className="flex items-start rounded-lg border-2 border-foreground p-4 pt-8 md:h-full md:items-center md:p-0">
			<Input
				placeholder="Search"
				autoComplete="off"
				className="h-full rounded-l-lg rounded-r-none border-none bg-white p-1 text-lg font-medium text-black"
				autoFocus={mode === "mobile"}
				value={name}
				name="name"
				onChange={(e) => {
					setName(e.currentTarget.value)
					afterChange({
						nameCur: e.currentTarget.value,
					})
				}}
			/>
			<button
				className="text-md flex h-8 w-12 flex-grow-0 items-center justify-center rounded-l-none rounded-r-md border-l-2 border-foreground bg-secondary p-0 px-1 text-center text-teal-400 hover:bg-secondary/5"
				type="submit"
				aria-label="search on the site"
			>
				<SearchIcon
					className="*:fill-foreground *:stroke-foreground"
					width="30px"
					height="30px"
				/>
			</button>
		</div>
	)
}
