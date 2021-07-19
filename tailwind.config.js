const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./src/client/**/*.tsx"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				primary: colors.emerald,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
