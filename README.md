[![Build Status](https://travis-ci.org/easilyBaffled/match.svg?branch=master)](https://travis-ci.org/easilyBaffled/match)
[![Coverage Status](https://coveralls.io/repos/github/easilyBaffled/match/badge.svg?branch=master)](https://coveralls.io/github/easilyBaffled/match?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7ed423c34981427a9e6d5cb6d9dfbb97)](https://www.codacy.com/app/easilyBaffled/match?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=easilyBaffled/match&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/easilyBaffled/match.svg)](https://greenkeeper.io/)

<p align="center">
    <img alt="match-by" src="media/match-by.svg" width="144">
</p>
<p align="center">
<a href="https://nodei.co/npm/<package>/"><img src="https://nodei.co/npm/<package>.png"></a>
</p>
<h3 align="center">
  Match
</h3>
<p align="center">
  Simple Matching for Mixed-Up Situations
</p>
This module was made with affection for but in no way trying to be a pattern matcher. We've already got that [on the way](https://github.com/tc39/proposal-pattern-matching). Instead it is made to replace ugly ternary.
It matches a test value to a simple key value. Simple in that the key must be a valid key in a object, so a primitive.


For example 
```javascript
const traficLightDisplay = intersection === 'stop'
							? 'red'
							: intersection === 'yeild'
								? 'yellow'
								: intersection === 'go'
									? 'green'
									: 'yellow flashing';
```
becomes 
```javascript
const intersectionSituation = 'stop';

const lightOptions = {
						stop: 'red',
						yeild: 'yellow',
						go: 'green',
						_: 'yellow flashing'
					};

const traficLightDisplay = match( lightOptions, intersectionSituation );
```
Though that situation could be cleared up with a mapper function. What a mapper couldn't cleanly handle for you would be something like 

```jsx
const ViewType = user.developer 
                    ? <Debug ... />
                    : user.admin
                        ? user.beta 
                            ? <Admin beta />
                            : <Admin />
                        : user.beta
                            ? <Customer beta />
                            : <Customer />
```
With `match` it becomes

```jsx
const userTypeViewMatching = match( {
							  developer: () => <Debug ... />
							  adminBeta: () => <Admin beta />
							  admin: () => <Admin />
							  userBeta: () => <Customer beta />
							  _: () => <Customer />
							} )

const ViewType = ( { userCase } ) => 
    userTypeViewMatching( { 
    	...userCase, 
    	adminBeta: userCase.admin && userCase.beta, 
    	customerBeta: !userCase.admin && userCase.beta 
	} )    
```

# Usage 

<h3><code>match(matchClauses, testExpression, [options={}])</code></h3>
[source](./index.js#L111 "View in source")

Match a value against a set of keys and produce the associated value.
The value may be a primitive, in which case it is matched directly against the keys of the `matchClauses` object.
The value may also be an object in which case, the keys in the object, whose values are not empty are used to match against the `matchClauses`.

#### Arguments
1. `matchClauses` *(Object)*: an object who's keys will be matched against. A default value, who's key is indicated by defaultKey, can be provided in the case that there is no match
2. `testExpression` *(Object|boolean|number|string)*: a value that will be matched against the keys of matchClauses
3. `[options={}]` *(Object)*: allow the user to set the defaultKey and matchAll case;
4. `[options.defaultKey=_]` *(string)*: The key used for the default value in the matchClauses.
5. `[options.matchAll=false]` *(boolean)*: If true `match` will return an array of all matches otherwise it will return just the first match

#### Returns
*(undefined|&#42;): Returns undefined if there is no match, otherwise returns the matching value(s)*

#### Example
```js
const matchClauses = {
  a: 1,
  b: 2,
  _: 'default' // <- '_' is the default `defaultKey`
};

match( matchClauses, 'a' )
// => 1

match( matchClauses, 'c' )
// => 'default'




// If the matching value is a function, it will be called with the `testExpression`
const matching = match( {
    function: matchFunction,
    object: matchObject,
    _: v => v
}, typeof 0 )
// => 'number'




// Match can be partially applied with just the matchClauses ahead of time.
<Fetch lazy url="https://api.github.com/users/easilyBaffled">
     {  // Fetch is a render prop that passes the fetch status (`{loading, data, error}`) to its child
      match( {
          data: ( { data } ) => <pre>{JSON.stringify(data, null, 2)}</pre>
          loading: () => <h1>...Loading</h1>,
          error: ({ error }) => <h1>{error.message}</h1>
      } )
  }
</Fetch>
```
