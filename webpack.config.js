const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: "./src/client/index.tsx",
	output: {
		path: path.resolve(__dirname, "dist/client"),
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [
			new TsconfigPathsPlugin({ configFile: "./src/client/tsconfig.json" }),
		],
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
		proxy: {
			// Pass through to the server api
			"/api": "http://localhost:3000",
		},
		historyApiFallback: true,
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: "./src/client/tsconfig.json",
			},
			eslint: {
				files: "./src/**/*.{ts,tsx}",
			},
		}),
		new HtmlWebpackPlugin({
			template: "./src/client/index.html",
		}),
	],
};