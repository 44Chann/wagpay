import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
	input: './src/embed.js',
	output: {
		format: 'iife',
		file: 'dist.js',
    	sourcemap: false,
		
	},
	plugins: [
		svelte({ emitCss: false, }),
		resolve({ browser: true, dedupe: ['svelte'], preferBuiltins: false }),
		commonjs(),
		json()
	],
	onwarn: function(warning) {
		// Skip certain warnings
	
		// should intercept ... but doesn't in some rollup versions
		if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
	
		// console.warn everything else
		console.warn( warning.message );
	}
}