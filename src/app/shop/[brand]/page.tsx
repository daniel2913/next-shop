import { redirect } from "next/navigation"

interface Props{
	params:{
		brand:string	
	}
	searchParams:{
		category:string,
		query:string
	}

}


export default function BrandRedirect({params,searchParams}:Props){
	
	let path = `/shop?brand=${params.brand}`
	if (searchParams.category) path += `&category=${searchParams.category}`
	if (searchParams.query) path += `&query=${searchParams.query}`
	redirect(path)
}
