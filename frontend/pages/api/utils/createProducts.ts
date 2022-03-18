import { supabase } from "../../../supabase";
import { Product } from "../product";

const createProducts = async (products: Product[], userId: number) => {
	let products_data = []
	
	for(let i=0;i<products.length;i++) {
		products[i].user = userId
		var { data, error } = await supabase.from('product').upsert(products[i])
		console.log(data, error, "ERROR")
		if(!data || error || data?.length === 0) {
			return products_data
		}
		products_data.push(data[0].id)
	}

	return products_data
}

export default createProducts