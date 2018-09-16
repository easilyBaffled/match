# [![Build Status](https://travis-ci.org/easilyBaffled/switch-component.svg?branch=master)](https://travis-ci.org/easilyBaffled/switch-component)
[![Coverage Status](https://coveralls.io/repos/github/easilyBaffled/switch-component/badge.svg?branch=master)](https://coveralls.io/github/easilyBaffled/switch-component?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/easilyBaffled/switch-component.svg)](https://greenkeeper.io/)

# Switch Component
A React component that resembles the `switch` case, if you squint a bit.
Use this component to remove some of those ugly but necessary ternary operators in your code.

### Match against primatives
```javascript
const word = 'number';

<Switch test={word} word="word">
    {{
        number: () => <h1>1</h1>,
        boolean: () => <h1>true</h1>,
        string: () => <h1>"Hi"</h1>,
    }}
</Switch>
```

### Include default values against primatives
```javascript
const word = 'undefined!';

<Switch test={word} word="word">
    {{
        number: () => <h1>1</h1>,
        boolean: () => <h1>true</h1>,
        string: () => <h1>"Hi"</h1>,
        _: () => <h1>None of the above</h1>
    }}
</Switch>
```

### Match against boolean values in an object
```javascript
<Fetch url="https://api.github.com/users/easilyBaffled">
    {({ loading, fetch, data, error }) => (
        <div>
            <button onClick={fetch}>Load Data</button>
            <Switch test={{ loading, data, error }}>
                {{
                    data: ({ test }) => (
                        <pre>{JSON.stringify(test.data, null, 2)}</pre>
                    ),
                    loading: () => <h1>...Loading</h1>,
                    error: ({ test }) => <h1>{test.error.message}</h1>
                }}
            </Switch>
        </div>
    )}
</Fetch>
```
# Roadmap
This project not only serves as a home for the Switch component, but also as template and learning ground for how I develop modules. 
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