import { BrandCache } from "@/helpers/cachedGeters";
import { BrandModel } from "@/lib/DAL/Models";
import Image from "next/image";

export default function Test(){
let i = 0
let t1s:number[] = []
let t2s:number[] = []
let t3s:number[] = []
async function test(){
while (i<50){
	console.log(i)
	const t1 = performance.now()
	let _ = await BrandModel.model.select().from(BrandModel.table)
	t1s.push(performance.now()-t1)
	const t2 = performance.now()
	_ = await BrandModel.find()
	t2s.push(performance.now()-t2)
	const t3 = performance.now()
	_ = await BrandCache.get()
	await BrandCache.revalidate()
	t3s.push(performance.now()-t3)
	i++
}
	console.log("*********************************")
	console.log(`New Cache: ${t2s.reduce((sum,n)=>sum+n,0)/t2s.length}`)
	console.log(t2s)
	console.log(`Old Cache: ${t3s.reduce((sum,n)=>sum+n,0)/t3s.length}`)
	console.log(t3s)
	console.log(`No Cache: ${t1s.reduce((sum,n)=>sum+n,0)/t1s.length}`)
	console.log(t1s)
	console.log("*********************************")
}

test()
	return(
		<Image
			alt="alt"
			src="/products/template.jpg"
			width={100}
			height={60}
		/>
	)
}
