/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	//daisyui: {
	//	themes: [
	//		{
	//			mypaper: {
	//				primary: '##6366f1'
	//			}
	//		}
	//	]
	//},
	plugins: [require('daisyui')]
};
