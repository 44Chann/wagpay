import { supabase } from "../../supabase";
import { Product } from "../product";

const createProducts = async (products: Product[]) => {
	let products_data = []
	
	for(let i=0;i<products.length;i++) {
		var { data, error } = await supabase.from('product').upsert(products[i])
		if(!data || error || data?.length === 0) {
			return products_data
		}
		products_data.push(data[0].id)
	}

	return products_data
}

export default createProducts