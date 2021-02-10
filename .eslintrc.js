module.exports = {
	extends: ["jonhaddow", "jonhaddow/typescript"],
	rules: {
		// Allow use of promises where void return is expected (e.g. setTimeout(asyncFunction, 100))
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				checksVoidReturn: false,
			},
		],

		// Disabling rules which add complication when handling 3rd party "any" types
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-call": "off",

		// Disabling because of some strange false positives
		// May be related - https://github.com/typescript-eslint/typescript-eslint/issues/2972
		"@typescript-eslint/no-unused-vars": "off",
	},
};
