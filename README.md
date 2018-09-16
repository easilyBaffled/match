[![Build Status](https://travis-ci.org/easilyBaffled/switch-component.svg?branch=master)](https://travis-ci.org/easilyBaffled/switch-component)

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
