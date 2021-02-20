module.exports = {
	extends: ["jonhaddow/react"],
	parserOptions: {
		sourceType: "module",
		project: "./src/client/tsconfig.json",
	},
	rules: {
		"no-console": "warn",
	},
	overrides: [
		{
			// disable the typescript rules specifically for JS files
			files: ["*.js", "*.jsx"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
			},
		},
	],
};
