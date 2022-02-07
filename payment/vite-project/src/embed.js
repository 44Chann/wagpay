import App from './App.svelte';

var div = document.createElement('DIV');
var script = document.currentScript;
script.parentNode.insertBefore(div, script);

const embed = new App({
	target: div
});