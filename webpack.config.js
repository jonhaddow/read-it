const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = ({ production }) => ({
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
	mode: production ? "production" : "development",
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
		new DefinePlugin({
			API_URL: production
				? JSON.stringify("https://alligator.app.haddow.me")
				: JSON.stringify(""),
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: "src/client/assets", to: "" }],
		}),
		new WorkboxPlugin.InjectManifest({
			swSrc: "./src/client/assets/service-worker.js",
		}),
	],
});
