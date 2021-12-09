const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./src/client/**/*.tsx"],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				primary: colors.emerald,
				"text-main": "var(--text-main)",
				"text-dimmed": "var(--text-dimmed)",
				background: "var(--background)",
				"background-shadow": "var(--background-shadow)",
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
