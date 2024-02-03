"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { Button } from "@/components/UI/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/UI/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover"
import { useCommandState } from "cmdk"
 

type Props = {
	children: React.ReactNode[]
	value?:string
	onValueChange?:(val:string)=>void
	placeholder?:string
	name?:string
}

 
export function Combobox(props:Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(props.value||"")
	React.useEffect(()=>{
		if (props.onValueChange)
			props.onValueChange(value)
	},[value])
  return (
    <Popover open={open} onOpenChange={setOpen}>
			<input hidden name={props.name||""} readOnly value={props.value}/>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? value
            : props.placeholder || "..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[99999999] w-[200px] p-0">
        <Command value={value} onClick={()=>setOpen(false)} onValueChange={(val)=>{setValue(val)}}>
          <CommandInput onClick={e=>e.stopPropagation()}/>
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
						{props.children}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
