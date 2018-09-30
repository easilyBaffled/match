[![Build Status](https://travis-ci.org/easilyBaffled/switch-component.svg?branch=master)](https://travis-ci.org/easilyBaffled/switch-component)
[![Coverage Status](https://coveralls.io/repos/github/easilyBaffled/switch-component/badge.svg?branch=master)](https://coveralls.io/github/easilyBaffled/switch-component?branch=master) 
[![Greenkeeper badge](https://badges.greenkeeper.io/easilyBaffled/switch-component.svg)](https://greenkeeper.io/)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7ed423c34981427a9e6d5cb6d9dfbb97)](https://www.codacy.com/app/easilyBaffled/match?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=easilyBaffled/match&amp;utm_campaign=Badge_Grade)

<p align="center">
    <img alt="match-by" src="match-by.svg" width="144">
</p>
<h3 align="center">
  Match
</h3>
<p align="center">
  Simple Matching for Mixed-Up Situations
</p>

This module is meant as a tidy replacement for the ugly but often necessary ternary operators.

While this was inspired by pattern matching ( check out the [propsal for JS](https://github.com/tc39/proposal-pattern-matching) ) 

It matches a test value to a simple key value. Simple in that the key must be a valid key in a object, so a primitive.  

### Match against primatives
```javascript
const word = 'number'

match( {
	number: () => <p>1</p>,
    boolean: () => <p>true</p>,
    string: () => <p>"Hi"</p>,
}, word )
```
> <p>1</p>



### Include default values against primatives
```javascript
const word = 'undefined!';

match( {
	number: () => <p>1</p>,
    boolean: () => <p>true</p>,
    string: () => <p>"Hi"</p>,
    _: () => <p>None of the above</p>
}, word )
```
> <p>None of the above</p>


### Match against boolean values in an object
```javascript
 <Fetch lazy url="https://api.github.com/users/easilyBaffled">
    { ( fetchStates ) =>
        match( {
            data: ( { data } ) => <pre>{JSON.stringify(data, null, 2)}</pre>
            loading: () => <h1>...Loading</h1>,
            error: ({ error }) => <h1>{error.message}</h1>
        }, fetchStates )
    }
 </Fetch>
```
# Roadmap
This project not only serves as a home for the Match component, but also as template and learning ground for how I develop modules. 
As such development moving forward will less focused on developing features and more on trying out and implementing dev support tools.
- [ ] Storybook - All the demos in one organized place
- [ ] CodeSandbox - forkable demos
- Build
	- [ ] Prepack - condense the nice readable code into something more performance
	- [ ] -ify - all of the usual transformations 
- [ ] Git hooks - no bad commits
- Typescript - just so I can try [GitHub - paldepind/ts-quickcheck: TypeScript QuickCheck](https://github.com/paldepind/ts-quickcheck)
	- [ ] Add definitions 
	- [ ] Add QuickCheck 
