const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = ({ production }) => ({
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
			{
				test: /\.css$/i,
				use: [
					production ? MiniCssExtractPlugin.loader : "style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: ["postcss-preset-env", "autoprefixer", "tailwindcss"],
							},
						},
					},
				],
			},
		],
	},
	devServer: {
		static: { directory: path.join(__dirname, "dist/client") },
		port: 9000,
		hot: false,
		historyApiFallback: true,
		client: {
			overlay: false,
		},
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
				: JSON.stringify("http://localhost:3000"),
			PRODUCTION: !!production,
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: "src/client/assets", to: "" }],
		}),
		production && new MiniCssExtractPlugin(),
	].filter(Boolean),
	optimization: {
		minimizer: [`...`, new CssMinimizerPlugin()],
	},
});
