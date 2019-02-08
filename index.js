if ( process.env.NODE_ENV === 'development' ) {
    console.ident = ( v, label = '' ) => (
        console.log( label, v ),
        v
    );
}


/**
 * Pulled from lodash https://github.com/lodash/lodash/blob/4.17.10/lodash.js#L11742
 * rather than bringing in the library itself
 * @param value
 * @returns {boolean}
 */
function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}

/**
 * Reducer function
 * @param {Object} testExpression
 * @returns {function(string[], string): string[]}
 */
const pullKeyWithTruthyValue = testExpression => ( acc, key ) =>
    testExpression[ key ]
        ? [ ...acc, key ]
        : acc;

/**
 *
 * @param {(Object|string|number|boolean)} testExpression
 * @param {Object} matchClauses
 * @returns {(Array|string|number|boolean)} a single primitive or an array of keys who's values in testExpression were not undefined
 */
export const extractMatchingKeys = ( testExpression, matchClauses = {} ) =>
    isObject( testExpression )
    // Pull out just the keys that are truthy
        ? Object.keys( matchClauses )
            .reduce( pullKeyWithTruthyValue( testExpression ), [] )
        : testExpression;

/**
 *
 * @param {Object} matchClauses
 * @returns {function(*[], *): *[]}
 */
const pickMatchingValues = matchClauses => ( matches, key ) =>
    matchClauses[ key ] === undefined
        ? matches
        : [ ...matches, matchClauses[ key ] ]; // Use spread instead of `.concat`, because `.concat` will flatten an array found with matchClauses[ key ]

/**
 *
 * @param {boolean} matchAll
 * @returns {function(*=[], *, number, *[]): *[]}
 */
const pickAllOrOne = matchAll => ( results = [], value, index, arr ) =>
// There is no clean way to break out of a reduce. So it has to loop through the whole thing to produce the result
    matchAll
        ? [ ...results, value ]
        : arr[ 0 ];

/**
 *
 * @param {Array|String} matchingKeys - an array of non-empty primitives
 * @param {Object} matchClauses - and object who's keys are a superset of the matchingkeys
 * @param {String} defaultKey - a single string
 * @param {boolean} matchAll - true|false
 * @returns {[*]|any|null} - null or a single item or subset of the values in matchClauses
 */
export const getMatchedValues = ( matchingKeys, matchClauses, defaultKey, matchAll = false ) =>
    [  // Ensure we are working with an array, and that the defaultKey is included
        ...( Array.isArray( matchingKeys )
            ? matchingKeys
            : [ matchingKeys ] )
        , defaultKey
    ]
        .reduce( pickMatchingValues( matchClauses ), [] ) // Pick out all of the values in matchClauses that have a matching key and is not undefined
        .reduce( pickAllOrOne( matchAll ), undefined ); // If the array is empty it means there were no matches and the function should return `undefined`, so undefined needs to be explicitly set here.

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
        return ( testExpression = '', options ) =>
            match( matchClauses, testExpression, options );

    const result = getMatchedValues( extractMatchingKeys( testExpression, matchClauses ), matchClauses, options.defaultKey || '_', options.matchAll || false );

    return typeof result === 'function'
        ? result( testExpression )
        : result;
};

const _makeEvaluators = (evaluators, target) => 
    Object.entries(evaluators)
        .reduce((acc, [name,evalFunc] ) => (acc, evalFunc, name) => ({ ...acc, [name]: evalFunc(target) }), {} )

export const makeEvaluators = ( evaluators, target ) => {
    if (!target) return _target => _makeEvaluators(evaluators, _target )
    return _makeEvaluators(evaluators, target)
}

export default match;
