const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

module.exports = ({ production }) => {
	const plugins = [
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
			PRODUCTION: !!production,
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: "src/client/assets", to: "" }],
		}),
	];

	if (production) {
		plugins.push(new MiniCssExtractPlugin());
	}

	return {
		entry: {
			main: "./src/client/index.tsx",
			worker: "./src/client/service-worker.js",
		},
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
						loader: "esbuild-loader",
						options: {
							loader: "tsx",
							target: "esnext",
						},
					},
				},
				{
					test: /\.css$/i,
					use: [
						production ? MiniCssExtractPlugin.loader : "style-loader",
						"css-loader",
						{
							loader: "postcss-loader",
							options: {
								postcssOptions: {
									plugins: [
										"postcss-preset-env",
										"autoprefixer",
										"tailwindcss",
									],
								},
							},
						},
					],
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
		plugins,
		optimization: {
			minimizer: [
				new ESBuildMinifyPlugin({
					target: "esnext",
					css: true, // Apply minification to CSS assets
				}),
			],
		},
	};
};
