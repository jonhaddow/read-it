module.exports = {
	extends: ["jonhaddow/react"],
	parserOptions: {
		sourceType: "module",
		project: "./src/client/tsconfig.json",
	},
	rules: {
		"no-console": "warn",
	},
};
