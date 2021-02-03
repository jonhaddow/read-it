const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./client/index.tsx",
	output: {
		path: path.resolve(__dirname, "dist/client"),
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	mode: "production",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
					},
				},
			},
		],
	},
	devServer: {
		contentBase: path.join(__dirname, "dist/client"),
		compress: true,
		port: 9000,
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			eslint: {
				files: "./client/**/*.{ts,tsx}",
			},
		}),
		new HtmlWebpackPlugin({
			template: "./client/index.html",
		}),
	],
};
