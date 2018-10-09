<h1 align="center" style="border-bottom: none;">
  Match
</h1>
<p align="center">
    <img alt="match-by" src="media/match-by.svg" width="144">
</p>
<p align="center">
<a href="https://nodei.co/npm/match-by/"><img src="https://nodei.co/npm/match-by.png"></a>
</p>
<p align="center">
<a href="https://travis-ci.org/easilyBaffled/match" rel="nofollow"><img src="https://camo.githubusercontent.com/fe9557a560551194c9e600170899447032f1eeb2/68747470733a2f2f7472617669732d63692e6f72672f656173696c79426166666c65642f6d617463682e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.org/easilyBaffled/match.svg?branch=master" style="max-width:100%;"></a>
<a href="https://coveralls.io/github/easilyBaffled/match?branch=master" rel="nofollow"><img src="https://camo.githubusercontent.com/4367e6f47be2033e9fdbb1819429a3befbbdfffc/68747470733a2f2f636f766572616c6c732e696f2f7265706f732f6769746875622f656173696c79426166666c65642f6d617463682f62616467652e7376673f6272616e63683d6d6173746572" alt="Coverage Status" data-canonical-src="https://coveralls.io/repos/github/easilyBaffled/match/badge.svg?branch=master" style="max-width:100%;"></a>
<a href="https://www.codacy.com/app/easilyBaffled/match?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=easilyBaffled/match&amp;utm_campaign=Badge_Grade" rel="nofollow"><img src="https://camo.githubusercontent.com/5e4eddac9d31ae942dc3aeb686b705852b5bbbc4/68747470733a2f2f6170692e636f646163792e636f6d2f70726f6a6563742f62616467652f47726164652f3765643432336333343938313432376139653664356362366439646662623937" alt="Codacy Badge" data-canonical-src="https://api.codacy.com/project/badge/Grade/7ed423c34981427a9e6d5cb6d9dfbb97" style="max-width:100%;"></a>
<a href="https://greenkeeper.io/" rel="nofollow"><img src="https://camo.githubusercontent.com/3fe5f96510bebfa5fc2adcfe114036d30ef2e3df/68747470733a2f2f6261646765732e677265656e6b65657065722e696f2f656173696c79426166666c65642f6d617463682e737667" alt="Greenkeeper badge" data-canonical-src="https://badges.greenkeeper.io/easilyBaffled/match.svg" style="max-width:100%;"></a>
</p>

<p align="center">
  Simple Matching for Mixed-Up Situations
</p>

---

This module was made with affection for but in no way trying to be a pattern matcher. We've already got that [on the way](https://github.com/tc39/proposal-pattern-matching). Instead, it is made to replace ugly ternary.
It matches a test value to a simple key value. Simple in that the key must be a valid key in an object, so a primitive.


## Motivating Examples 
```javascript
const traficLightDisplay = 
    intersection === 'stop'
        ? 'red'
        : intersection === 'yeild'
            ? 'yellow'
            : intersection === 'go'
                ? 'green'
                : 'yellow flashing';
```
becomes 
```javascript
const lightOptions = {
    stop: 'red',
    yeild: 'yellow',
    go: 'green',
    _: 'yellow flashing'
};

const traficLightDisplay = match( lightOptions, 'stop' );
```
Though that situation could be cleared up with a mapper function. What a mapper couldn't cleanly handle for you would be something like 

```jsx harmony
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

```jsx harmony
const userTypeViewMatching = match( {
    developer: () => <Debug />,
    adminBeta: () => <Admin beta />,
    admin: () => <Admin />,
    userBeta: () => <Customer beta />,
    _: () => <Customer />
} );

const ViewType = ( { userCase } ) =>
    userTypeViewMatching( {
        ...userCase,
        adminBeta: userCase.admin && userCase.beta,
        customerBeta: !userCase.admin && userCase.beta
    } );  
```

There is an additional option `matchAll` that will let you turn 
```jsx harmony
const WeatherCard = ({ sunny, cloudy, windy, rain, snow }) => (
    <Card>
        {sunny && <SunIcon />}
        {cloudy && <CloudIcon />}
        {windy && <WindIcon />}
        {rain && <RainIcon />}
        {snow && <SnowIcon />}
    </Card>
);
```
into 
```jsx harmony
const weatherCardMatcher = match(
    {
        sunny: SunIcon,
        cloudy: CloudIcon,
        windy: WindIcon,
        rain: RainIcon,
        snow: SnowIcon
    },
    { matchAll: true }
);

const WeatherCard = props => <Card>{weatherCardMatcher(props)}</Card>;
```


## Usage
```js
match( {
    'a': 1,
    'b': 2
}, 'a' );
// => 1
```

Will return undefined if no match is found
```javascript
match( {
    'a': 1,
    'b': 2
}, 'c' );
// => undefined 
```

Will return a default value when no match is found if a default key/value is in the matchClauses
```javascript
match( {
    'a': 1,
    'b': 2,
    _: 'default' // <- '_' is the default `defaultKey`
}, 'c' );
// => 'default' 
```


Match can be partially applied with just the matchClauses ahead of time.
```js
const requestStatus = match( {
    200: 'success',
    404: 'JSON not found',
    _: 'Request Failed'
} );

const res = await fetch( jsonService )
requestStatus( res.status )
```


If the matching value is a function, it will be called with the `testExpression`
```javascript
const getVectorLength = match( {
        z: ( { x, y, z } ) => Math.sqrt(x ** 2 + y ** 2 + z ** 2),
        y: ( { x, y } ) => Math.sqrt(x ** 2 + y ** 2 ),
        _: vector => vector.length
    } );
getVectorLength({x: 1, y: 2, z: 3})
// =>  3.74165
```


```jsx harmony
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

## API 

<h3><code>match(matchClauses, testExpression, [options={}])</code></h3>
[source](./index.js#L111 "View in source")

Match a value against a set of keys and produce the associated value.
The value may be a primitive, in which case it is matched directly against the keys of the `matchClauses` object.
The value may also be an object in which case, the keys in the object, whose values are not empty are used to match against the `matchClauses`.

#### Arguments
1. `matchClauses` *(Object)*: an object whose keys will be matched against. A default value, whose key is indicated by defaultKey, can be provided in the case that there is no match
2. `testExpression` *(Object|boolean|number|string)*: a value that will be matched against the keys of matchClauses
3. `[options={}]` *(Object)*: allow the user to set the defaultKey and matchAll case;
4. `[options.defaultKey=_]` *(string)*: The key used for the default value in the matchClauses.
5. `[options.matchAll=false]` *(boolean)*: If true `match` will return an array of all matches otherwise it will return just the first match

#### Returns
*(undefined|&#42;): Returns undefined if there is no match, otherwise returns the matching value(s)*
