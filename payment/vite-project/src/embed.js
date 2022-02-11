import App from './App.svelte';

var div = document.createElement('DIV');
var script = document.currentScript;
script.parentNode.insertBefore(div, script);

const url = window.location.href.split('/')
const payment_id = url[url.length - 1]

fetch(`/pay/${payment_id}`, {
	headers: {
		signed_msg: 'eyJzaWduYXR1cmUiOiIweDFlODMxNzgzYTA3OWU0OGI1MGJhZGQyOTUwNWM2ZTFlMzZkN2NkNThjNzYxMjEwYWY3OTBmYzIzNTZlY2YwY2QxYzE1NmVhNDdkMjZjYjY1ODY2ZTMzODcxZjQ5YWQyNWY5MmRhMzM3MTdlZTI0ODM1ZWQ3YzFhYWQ5Yjg0YmUwMWMiLCJib2R5IjoiVVJJOiBodHRwOi8vbG9jYWxob3N0OjMwMDAvXG5XZWIzIFRva2VuIFZlcnNpb246IDJcbk5vbmNlOiA4MjIxMTc4MlxuSXNzdWVkIEF0OiAyMDIyLTAyLTEwVDA2OjMwOjU1LjAxMFpcbkV4cGlyYXRpb24gVGltZTogMjAyMi0wMi0xMVQwNjozMDo1NS4wMDBaIn0',
	}
})
	.then(data => data.json())
	.then(res => {
		const embed = new App({
			target: div,
			props: { value: res.amount }
		});
	})
	.catch(e => console.error(e))
