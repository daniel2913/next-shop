/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			white: "#ffffff",
			accent1: {
				100: "#fad0d6",
				200: "#f4a0ae",
				300: "#ef7185",
				400: "#e9415d",
				500: "#e41234",
				600: "#b60e2a",
				700: "#890b1f",
				800: "#5b0715",
				900: "#2e040a",
			},
			accent2: {
				100: "#d1fbf4",
				200: "#a4f8ea",
				300: "#76f4df",
				400: "#49f1d5",
				500: "#1bedca",
				600: "#16bea2",
				700: "#108e79",
				800: "#0b5f51",
				900: "#052f28",
			},
			cyan: colors.cyan,
			teal: colors.teal,
			gray: colors.gray,
		},
		extend: {},
	},
	plugins: [],
}
