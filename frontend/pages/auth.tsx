import { supabase } from "../supabase"
import { useState } from "react"
import { useRouter } from 'next/router'

const Auth: React.FC = () => {
	const [email, setEmail] = useState('')

	const { push } = useRouter()

	const getOrCreateUser = async (email: string) => {
		let { data, error } = await supabase.from('User').select('*').eq('email', email)

		console.log(error)
		if(error || data?.length === 0) {
			let { data, error } = await supabase.from('User').insert([{ username: email, email: email }])
			
			if(error || data?.length === 0) {
				console.log(error)
				return false
			}
		}

		return true
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const { error } = await supabase.auth.signIn({ email })
		if (!error) {
			getOrCreateUser(email)
			push('/')
		}
	}

	return (
	  <div className="border rounded-lg p-12 w-4/12 mx-auto my-48">
		<h3 className="font-extrabold text-3xl">Ahoy!</h3>
  
		<p className="text-gray-500 text-sm mt-4">
		  Fill in your email, we'll send you a magic link.
		</p>
  
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				placeholder="Your email address"
				className="border w-full p-3 rounded-lg mt-4 focus:border-indigo-500"
				onChange={e => setEmail(e.target.value)}
			/>
  
		  <button
			type="submit"
			className="bg-indigo-500 text-white w-full p-3 rounded-lg mt-8 hover:bg-indigo-700"
		  >
			Let's go!
		  </button>
		</form>
	  </div>
	)
  }
  
  export default Auth