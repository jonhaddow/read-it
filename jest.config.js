// Set environment variables for use within tests
process.env["NODE_CONFIG_DIR"] = __dirname + "/src/server/config";

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
module.exports = {
	// The test environment that will be used for testing
	testEnvironment: "node",

	// Give some time for E2E web scraping
	testTimeout: 20000,
};
