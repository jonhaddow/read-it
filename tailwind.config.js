const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./src/client/**/*.tsx"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				primary: "var(--primary)",
				"primary-hover": "var(--primary-hover)",
				"text-main": "var(--text-main)",
				"text-secondary": "var(--text-secondary)",
				"text-light": "var(--text-light)",
				"text-dark": "var(--text-dark)",
				background: "var(--background)",
				"background-hover": "var(--background-hover)",
				"card-shade": "var(--card-shade)",
				"card-shade-hover": "var(--card-shade-hover)",
				warning: "var(--warning)",
				"warning-hover": "var(--warning-hover)",
			},
		},
	},
	variants: {
		extend: {
			opacity: ["group-hover"],
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
