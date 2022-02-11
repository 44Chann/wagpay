import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../client";
import { definitions } from "../types";

export async function create_payer(payer: definitions['Payer']): Promise<[Array<definitions['Payer']> | null, PostgrestError | null]> {
	const { data, error } = await supabase
		.from('Payer')
		.insert([payer])
	
	return [data, error]
}