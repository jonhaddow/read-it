module.exports = {
	rules: {
		// Using the following types - https://github.com/commitizen/conventional-commit-types
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"perf",
				"test",
				"build",
				"ci",
				"chore",
				"revert",
			],
		],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"scope-enum": [2, "always", ["client", "server"]],
		"scope-case": [2, "always", "lower-case"],
	},
};
