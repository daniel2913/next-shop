export default function calcPrice(price:number,discount?:number){
	return Number((price - (price*(discount||0))/100).toFixed(2))
}
