module.exports = {
	extends: ["jonhaddow", "plugin:tailwindcss/recommended"],
	plugins: ["tailwindcss"],
	rules: {
		"sort-imports": [
			"warn",
			{
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
			},
		],
	},
};
