import { supabase } from "../client"

export async function create_unique_button_id(store_id: string, invoice_id: string, created_at: string): Promise<string> {
	var button_id = Math.random().toString(36).slice(2)
	
	const { data, error } = await supabase.from('Payment Button').select('unique_id').csv()
	
	const ids = data?.split('\n').splice(1)
	
	while(ids?.find(id => id === button_id)) {
		button_id = Math.random().toString(36).slice(2)
	}
	
	return button_id
}