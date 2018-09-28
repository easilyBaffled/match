// import React from 'react';
// import ReactDOM from 'react-dom';
// import './styles.css';
// import App from './example/App';
//
// console.ident = v => (console.log(v), v);
//
// const rootElement = document.getElementById('root');
// ReactDOM.render(<App />, rootElement);

console.ident = ( v, label = '' ) => ( console.log( label, v ), v );

// Pulled from lodash https://github.com/lodash/lodash/blob/4.17.10/lodash.js#L11742
// rather than brining in the library itself
function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}

export const extractMatchingKeys = ( testExpression, matchClauses = {} ) =>
    isObject(testExpression)
        ? Object.entries(testExpression) // Pull out just the keys that are true)
            .filter(([key, bool]) => !!bool && key in matchClauses)
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
    matchAll
        ? matchingKeys
            .concat( defaultKey )
            .reduce( ( matches, key ) =>
                matches.concat( matchClauses[ key ] ),
                [] )
        : matchingKeys in matchClauses
            ? matchClauses[ matchingKeys ]
            : defaultKey in matchClauses
                ? matchClauses[ defaultKey ]
                : null;

const match_array = () => [];

export default ( matchClauses, defaultKey = '_' ) => {
    if ( Array.isArray( matchClauses ) )
        return match_array( matchClauses );

    if (!isObject(matchClauses))
    {
        throw Error(
            `matchClauses must be either an Object or Array instead it recived ${typeof matchClauses}`
        );
    }

    return ( testExpression, matchAll = false ) =>
        getMatchedValues( extractMatchingKeys( testExpression, matchClauses ), matchClauses, defaultKey, matchAll );
};
