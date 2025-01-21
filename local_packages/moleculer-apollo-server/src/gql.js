const { zip } = require("lodash");

/**
 * @function gql Format graphql strings for usage in moleculer-apollo-server
 * @param {TemplateStringsArray} typeString - Template string array for formatting
 * @param  {...string} placeholders - Placeholder expressions
 */
const gql = (typeString, ...placeholders) => {
	// combine template string array and placeholders into a single string
	const zipped = zip(typeString, placeholders);
	const combinedString = zipped.reduce(
		(prev, [next, placeholder]) => `${prev}${next}${placeholder || ""}`,
		"",
	);
	const re = /type\s+(Query|Mutation|Subscription)\s+{(.*?)}/s;

	const result = re.exec(combinedString);
	// eliminate Query/Mutation/Subscription wrapper if present as moleculer-apollo-server will stitch them together
	return Array.isArray(result) ? result[2] : combinedString;
};

module.exports = gql;
