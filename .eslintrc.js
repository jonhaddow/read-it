module.exports = {
	extends: ["jonhaddow", "jonhaddow/typescript"],
	rules: {
		// Disabling because of some strange false positives
		// May be related - https://github.com/typescript-eslint/typescript-eslint/issues/2972
		"@typescript-eslint/no-unused-vars": "off",
	},
};
