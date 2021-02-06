module.exports = {
	extends: ["jonhaddow/react"],
	parserOptions: {
		sourceType: "module",
		project: "./client/tsconfig.json",
	},
	rules: {
		"react/prop-types": "off",
	},
};
