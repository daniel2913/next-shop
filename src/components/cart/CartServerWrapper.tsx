import { auth } from "@/actions/common"
import { CartControler } from "./CartControler"

export default async function CartControllerServer(){
	try{
		const user = await auth("user")
		return (
			<CartControler cart={user.cart} saved={user.saved} votes={user.votes}/>
		)
	}
	catch{
		return(
			<CartControler cart={{}} saved={[]} votes={{}}/>
		)
	}
}
