"use server"
import { BrandCache, CategoryCache } from "@/helpers/cachedGeters";
import fs from "fs/promises"
import path from "path"
import { ProductModel } from "@/lib/Models";
import { populateProducts } from "@/helpers/getProducts";

const lorem = `Nulla facilisi. Aliquam erat volutpat. Phasellus dapibus est in turpis congue, nec suscipit nulla luctus. Nunc euismod metus turpis, vitae accumsan erat scelerisque sit amet. Aliquam justo lacus, sagittis non euismod sit amet, consequat id nibh. Maecenas ut nulla neque. Donec at facilisis erat. Donec a massa sem. Integer nec purus a mi rhoncus aliquet.
Nam pretium, lorem ac iaculis gravida, purus odio accumsan odio, sed feugiat ligula ante et lacus. In quis leo nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam vel mattis ipsum, ac tincidunt velit. Nunc gravida lacus in orci sollicitudin viverra. Vestibulum dolor mi, cursus nec ornare eget, cursus ac purus. Vestibulum non odio ligula. Ut dapibus ultrices odio, vel pellentesque nisl euismod non.
Maecenas aliquam massa a ante facilisis suscipit. Pellentesque vel viverra turpis. Etiam eu augue sapien. Cras sed diam eget ex lobortis sollicitudin. Etiam efficitur erat eu facilisis ultrices. Vivamus sagittis orci id ligula pharetra, et cursus justo fermentum. Phasellus viverra tortor ac velit ullamcorper, ac vestibulum lectus dapibus.
Pellentesque nisl eros, pellentesque eu augue eget, dapibus laoreet ex. Maecenas vitae turpis sollicitudin dui tincidunt venenatis. Vivamus vehicula nisi ut turpis laoreet, eu dictum tortor convallis. Ut vitae egestas urna. Proin suscipit sem et mattis aliquet. Ut egestas lobortis risus et faucibus. Curabitur hendrerit maximus dui, eget luctus mi ultrices ac.
Suspendisse potenti. Nam a dolor arcu. Vestibulum at venenatis turpis. Vestibulum pellentesque tempor viverra. Proin facilisis eget arcu et pulvinar. Integer molestie, eros id mollis auctor, lectus erat tempor massa, non commodo orci neque vitae magna. Nunc dictum dui nec urna bibendum, porttitor convallis sem consectetur. Suspendisse rutrum consequat eros, sed sollicitudin neque blandit eget.
Suspendisse eu quam elit. Quisque sem est, posuere rutrum augue sit amet, rhoncus mollis felis. Proin facilisis id odio eget bibendum. Suspendisse felis neque, bibendum vel interdum ut, dapibus sit amet nibh. Vivamus sagittis nec massa sit amet porta. Nullam pretium, ligula vitae tincidunt dictum, leo tortor porta dui, volutpat maximus risus urna quis lectus. Quisque accumsan feugiat volutpat. Donec dignissim sagittis imperdiet. Proin dapibus, eros eget posuere sodales, arcu justo efficitur lacus, quis rutrum felis risus id leo. Donec tincidunt efficitur ex dictum ultricies.
Proin sollicitudin nulla eget libero vulputate rhoncus. Proin lacus quam, dapibus vitae elit ac, interdum venenatis tortor. Ut iaculis leo eu libero consectetur sodales at suscipit ante. Aliquam dignissim purus ac justo dapibus, et laoreet urna ultrices. Integer vel arcu erat. Nullam vel nisi luctus, pharetra purus sed, malesuada urna. Sed elementum nulla at ultrices feugiat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Pellentesque molestie efficitur tortor, vel cursus ex bibendum vitae. Duis egestas ultrices eros, ac laoreet lectus accumsan et. Etiam porttitor eleifend ultrices. Vivamus vestibulum sagittis eros vel vehicula. Nullam non nunc in nibh lacinia cursus. Nam non nulla scelerisque, posuere leo eu, ultricies arcu. Suspendisse congue congue bibendum. Mauris faucibus interdum eros, lacinia egestas nisi interdum quis. Pellentesque viverra dui sit amet erat convallis, sit amet consequat lacus tempor. Sed facilisis nisi ut arcu ultrices hendrerit molestie a massa. Sed faucibus non mi non eleifend. Maecenas faucibus, ipsum at vehicula faucibus, diam nibh placerat augue, non efficitur leo est non est.
Aliquam erat volutpat. Suspendisse sit amet libero in ex vulputate porttitor id ut ex. Vivamus at posuere odio, id sodales ipsum. Suspendisse potenti. Mauris et tellus eu turpis condimentum fermentum sit amet id est. Nam eleifend lectus quis massa semper, quis laoreet mi lacinia. Nullam in eros tincidunt, feugiat ante a, mattis ex. Phasellus eget mollis magna. Donec consectetur arcu nec dolor fermentum faucibus.
Mauris ullamcorper ipsum non urna semper, at luctus massa imperdiet. Donec commodo rhoncus vestibulum. Praesent semper vestibulum nunc, eu laoreet ante porta non. Vivamus pellentesque commodo tellus in porttitor. Mauris libero velit, ultrices eu iaculis in, vulputate ac purus. Pellentesque a turpis vitae quam molestie porttitor vitae quis velit. Aliquam accumsan nibh sit amet felis malesuada, quis lobortis turpis dapibus. Suspendisse vel imperdiet nunc, in feugiat urna. Mauris vitae sagittis metus. Integer consequat vehicula quam et fermentum. Integer cursus elit eros, in pretium velit molestie quis. Donec vehicula, libero ut rhoncus volutpat, nisi felis egestas justo, eget laoreet arcu odio sed ex. Nullam cursus efficitur enim, vitae fermentum quam congue at. Proin tortor diam, suscipit et tellus id, finibus consequat ipsum. Sed eget aliquet turpis, sit amet placerat diam. Cras tempus sapien est, nec placerat odio laoreet vitae.
Proin ut neque dolor. In sit amet dictum justo. Cras magna sem, dictum non massa in, ultricies bibendum ipsum. Pellentesque eu ligula neque. Nullam lacinia odio risus, quis efficitur odio viverra pharetra. Nullam luctus convallis varius. Cras congue dictum ipsum, a viverra ex fermentum vestibulum.
Nam maximus, turpis id auctor finibus, ex felis pharetra purus, at commodo mauris odio vitae mi. Donec maximus congue felis vel cursus. Vivamus hendrerit neque dolor, sed cursus diam consectetur vel. Maecenas orci augue, rhoncus at pharetra sit amet, finibus in odio. Phasellus eget cursus felis. Proin porta lorem eget volutpat elementum. Integer eu nulla quis libero euismod venenatis sed ut sapien. Proin in posuere leo, ut malesuada ligula. Donec faucibus orci quam, at suscipit turpis porttitor eu. Vivamus at arcu neque. Mauris feugiat augue nunc, sed eleifend ex pretium nec. Nulla sagittis condimentum turpis, eget accumsan magna ultricies in. Cras mollis lacus velit, vel egestas metus rhoncus eget. Integer a sodales felis, nec aliquet mi. Nulla tempor nibh at diam pulvinar gravida.
Donec congue faucibus mauris et tincidunt. Aenean sapien lectus, dapibus sit amet tempus eget, vehicula sed justo. Etiam sit amet urna vel nulla tempus ullamcorper. Donec pellentesque, lorem vel ullamcorper pharetra, urna velit dignissim tellus, a scelerisque risus magna mollis est. Quisque ornare volutpat enim id egestas. Integer eleifend mi sit amet eros porta lobortis. Aliquam erat volutpat. Nullam pretium, dolor vel volutpat commodo, velit tortor feugiat mi, at lacinia est massa vel enim.
Nunc magna diam, bibendum sit amet urna sed, lobortis tempus nisi. Praesent vitae sagittis enim. Aliquam facilisis nisi id dui malesuada, vitae ultricies nisi ullamcorper. Aliquam augue tortor, egestas non erat eu, pellentesque ullamcorper diam. Suspendisse posuere laoreet metus vitae gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat non mi a convallis. Mauris mollis, dui at volutpat pretium, metus diam dictum felis, sed pellentesque tortor lorem at nibh.
Nullam luctus accumsan lorem. Morbi ut lobortis turpis. Quisque condimentum vestibulum erat eget dictum. In tortor mi, ornare et blandit sed, ornare quis magna. In nec ipsum ac sem dapibus maximus. Integer id accumsan risus. Nullam quam odio, tempus semper mauris non, elementum mollis neque.
Etiam sit amet posuere libero. Curabitur faucibus tempor nisl, in congue lacus lacinia vel. Sed in pharetra massa. Etiam id purus nunc. Quisque volutpat lorem maximus tincidunt semper. Vivamus vitae urna felis. Morbi imperdiet metus in porta ornare. Donec sed placerat urna. Duis tempus nisi eros, in gravida nunc tristique eget. Duis euismod tincidunt libero. Donec dui tortor, iaculis eget ornare a, tristique a leo. Quisque eu ex id nisi efficitur blandit. Duis ultricies, purus vel mattis viverra, purus neque sodales velit, et lacinia tellus elit vitae velit.
Etiam quis est et felis mollis rhoncus vel non lorem. Aliquam scelerisque orci in orci facilisis sagittis. Integer et nibh in orci consectetur mollis. Nulla mattis libero non mauris gravida luctus. Nunc vel neque a est ullamcorper ullamcorper. Morbi vitae ante blandit, consequat nisl quis, dignissim ipsum. In sed massa sagittis, eleifend neque sit amet, vestibulum dolor.
Aenean posuere justo vitae elit convallis consequat. In hac habitasse platea dictumst. Vivamus id libero urna. Vivamus cursus pretium tellus, et ornare quam fermentum non. Cras lacus urna, commodo sed massa a, facilisis elementum sem. Nullam rutrum, nibh sed malesuada vulputate, ipsum nibh cursus est, vehicula elementum ipsum eros sit amet sapien. Pellentesque rhoncus, purus eget faucibus gravida, turpis massa consequat lacus, volutpat varius velit odio eu libero. Donec eu mattis nisi, at laoreet felis. Sed accumsan volutpat ante. Vivamus vitae pharetra dui. Nulla facilisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus at commodo nunc, vitae venenatis massa. Nunc tortor massa, vulputate et pharetra non, ultrices sit amet leo. Praesent quam ipsum, gravida nec venenatis quis, tempus id velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
Nam laoreet metus nec ante maximus cursus. Proin id pharetra lorem. Duis varius est ut erat tempus, sed semper augue porta. Ut et imperdiet quam. Maecenas at commodo ante. Sed ornare enim at sagittis eleifend. Integer pretium auctor turpis. Praesent a metus sit amet sem imperdiet rutrum ac vitae nibh.
Suspendisse et lectus neque. Nunc ut arcu efficitur libero dapibus fermentum id vitae ex. Fusce pellentesque euismod orci ut maximus. Morbi et bibendum orci. Curabitur tincidunt diam sed sem faucibus, ac ornare mauris tempor. Duis dignissim quam eu purus dignissim, ut facilisis nibh tristique. Morbi ut dignissim ante, ut aliquet tellus. Nullam ut tincidunt lorem. Ut sit amet turpis faucibus, vestibulum lectus vel, hendrerit purus. Ut eu nunc nibh. Pellentesque interdum dolor dignissim nibh bibendum, sed egestas neque maximus.
`

const loremsPars = lorem.split("\n")
const loremWords = lorem.split(" ").filter(word=>!(word.includes(",")&&!(word.includes(".")&&word.length>=5)))

export async function generateProductAction(){
	try{
	const [brands,categories] = await Promise.all([
		BrandCache.get(),
		CategoryCache.get()
	])
	const brand = brands[Math.floor((Math.random()*1000)%brands.length)]
	const category = brand.name === "Subcapitalia"
		? categories.find(cat=>cat.name==="Headrests")!
		: categories[Math.floor((Math.random()*1000)%categories.length)]
	const base = `/users/user/desktop/mock/${category.name}`
	const allimages = (await fs.readdir(base)).map(fileName => {
  return path.join(base, fileName)
	})
	const images:File[] = []
	const imgNum = (Math.random()*1000)%4+1
	for (let i=0;i<imgNum;i++){
		const path = allimages[Math.floor((Math.random()*1000)%allimages.length)]
		const buf = await fs.readFile(path)
		images.push(new File([buf],path.split("/").pop()!,{type:"image/jpg"}))
	}
	
	const prices = [220,69,420,2200,11.99,228]
	const price = prices[Math.floor((Math.random()*1000)%prices.length)]
	let description = ""
	const desclength = Math.floor((Math.random()*1000)%10)+1
	for (let i=0;i<desclength;i++){
		if (description) description += "\n\n"
		description += loremsPars[Math.floor((Math.random()*1000)%loremsPars.length)]
	}
	let name = ""
	while (name.length < 14){
		if (name) name += " "
		name += loremWords[Math.floor((Math.random()*1000)%loremWords.length)]
	}
	const props = {
		name,
		description,
		brand:brand.id,
		category:category.id,
		price,
		images
	}
	const res = await ProductModel.create(props)
	if (!res) throw "not res"
	return (await populateProducts([res]))[0]
	}
	catch(error){
		console.error(error)
	}
}
