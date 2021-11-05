module.exports = {
	plugins: [
		"babel-plugin-transform-typescript-metadata",
		["@babel/plugin-proposal-decorators", { legacy: true }],
	],
	presets: [
		["@babel/preset-env", { targets: { node: "current" } }],
		"@babel/preset-typescript",
	],
};
