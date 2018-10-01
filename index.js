// console.ident = ( v, label = '' ) => ( console.log( label, v ), v );

// Pulled from lodash https://github.com/lodash/lodash/blob/4.17.10/lodash.js#L11742
// rather than brining in the library itself
function isObject(value) {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
}

export const extractMatchingKeys = ( testExpression, matchClauses = {} ) =>
	isObject(testExpression)
		? Object.entries(matchClauses) // Pull out just the keys that are true)
			.filter( ( [ key ] ) => !!testExpression[ key ] )
			.map( v => v[ 0 ] )
		: testExpression;
/**
 *
 * @param {Array|String} matchingKeys - an array of non-empty primitives
 * @param {Object} matchClauses - and object who's keys are a superset of the matchingkeys
 * @param {String} defaultKey - a single string
 * @param {boolean} matchAll - true|false
 * @returns {[*]|any|null} - null or a single item or subset of the values in matchClauses
 */
export const getMatchedValues = ( matchingKeys, matchClauses, defaultKey, matchAll = false ) =>
		[].concat( matchingKeys )
			.concat( defaultKey )
			.reduce( ( matches, key ) =>
					[ ...matches, matchClauses[ key ] ], // Use spread instead of `.concat`, because `.concat` will flatten an array found with matchClauses[ key ]
				[] )
			.filter( v => v !== undefined )
			.reduce( ( results = [], value, index, arr ) =>
				matchAll
					? [ ...results, value ]
					: arr[ 0 ]
			, undefined );
/*
* 	matchAll
		? [].concat( matchingKeys )
			.concat( defaultKey )
			.reduce( ( matches, key ) =>
					matches.concat( matchClauses[ key ] ),
				[] )
			.filter( v => v !== undefined )
		: matchingKeys in matchClauses
			? matchClauses[ matchingKeys ]
			: defaultKey in matchClauses
				? matchClauses[ defaultKey ]
				: undefined;
* */

/**
 * Options for the `match` function
 * @typedef {Object} Options
 * @property {string} [ defaultKey = _ ]  - The key used for the default value in the matchClauses.
 * @property {boolean} [ matchAll = false ] - If true `match` will return an array of all matches otherwise it will return just the first match
 */
/**
 * Match a value against a set of keys and produce the associated value.
 * The value may be a primitive, in which case it is matched directly against the keys of the `matchClauses` object.
 * The value may also be an object in which case, the keys in the object, whose values are not empty are used to match against the `matchClauses`.
 *
 * @param {Object} matchClauses - an object who's keys will be matched against. A default value, who's key is indicated by defaultKey, can be provided in the case that there is no match
 * @param {(Object|string|number|boolean)} testExpression - a value that will be matched against the keys of matchClauses
 * @param {Object} [options={}] - allow the user to set the defaultKey and matchAll case;
 * @param {string} [options.defaultKey=_]  - The key used for the default value in the matchClauses.
 * @param {boolean} [options.matchAll=false] - If true `match` will return an array of all matches otherwise it will return just the first match
 * @returns {(undefined|*|[*])} Returns undefined if there is no match, otherwise returns the matching value(s)
 *
 * @example
 * const matchClauses = {
 *   a: 1,
 *   b: 2,
 *   _: 'default' // <- '_' is the default `defaultKey`
 * };
 *
 * match( matchClauses, 'a' )
 * // => 1
 *
 * match( matchClauses, 'c' )
 * // => 'default'
 *
 *
 * // If the matching value is a function, it will be called with the `testExpression`
 * const matching = match( {
 *     function: matchFunction
 *     object: matchObject
 *     _: v => v
 * }, typeof 0 )
 * // => 'number'
 *
 *
 * // Match can be partially applied with just the matchClauses ahead of time.
 * <Fetch lazy url="https://api.github.com/users/easilyBaffled">
 *      {  // Fetch is a render prop that passes the fetch status (`{loading, data, error}`) to its child
 *       match( {
 *           data: ( { data } ) => <pre>{JSON.stringify(data, null, 2)}</pre>
 *           loading: () => <h1>...Loading</h1>,
 *           error: ({ error }) => <h1>{error.message}</h1>
 *       } )
 *
 *   }
 * </Fetch>
 *
 */

const match = ( matchClauses, testExpression, options = {} ) => {
	if (Array.isArray(matchClauses) || !isObject(matchClauses))
	{
		throw TypeError(
			`matchClauses must be an Object instead it received ${typeof matchClauses}`
		);
	}

	if  ( testExpression === undefined )
		return ( testExpression = '', options ) => match( matchClauses, testExpression, options );

	const result = getMatchedValues( extractMatchingKeys( testExpression, matchClauses ), matchClauses, options.defaultKey || '_', options.matchAll || false );

	return typeof result === 'function'
		? result( testExpression )
		: result;
};

export default match;
