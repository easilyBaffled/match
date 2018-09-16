import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

console.ident = v => (console.log(v), v);

function isObject(value) {
    var type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}

const defaultKey = '_';

// Prettier tries to wrap the inner ternaries in `( )` which screws up the parsing order
// See https://stackoverflow.com/questions/48309694/why-cant-i-use-a-ternary-operator-and-arrow-function-in-this-way-in-jsx?rq=1
// prettier-ignore
const isAMatch = test =>
    isObject(test) 
        ? match => typeof match === 'function' ? match(test) : match in test
        : match => typeof match === 'function' ? match(test) : match === test;

const Switch_Array = (
    { children, testFunc } // children must be elements
) => {
    children = React.Children.toArray(children);
    const filteredChildren = children.filter(
        child =>
            React.isValidElement(child) &&
            child.props.match &&
            testFunc(child.props.match)
    );

    return filteredChildren.length
        ? filteredChildren
        : children.find(child => child.props.matchDefault);
};

const extractMatchingKey = test =>
    isObject(test)
        ? Object.entries(test) // Pull out just the keys that are true
              .concat([[defaultKey, true]])
              .filter(([key, bool]) => bool)[0][0]
        : test;

const matchKeyToChild = (children, key, props) => {
    const child = key in children ? children[key] : children[defaultKey];

    if (!child) return null; // No need to move forward if there was no match and no default

    return typeof child === 'function'
        ? child(props)
        : React.cloneElement(child, props);
};

const Switch = ({ children, withFallThrough, ...props }) => {
    if (Array.isArray(children))
        return Switch_Array({ children, testFunc: isAMatch(props.test) });

    const { test } = props; // test is pulled out here so that it's still a part of props that are passed to the child
    const key = extractMatchingKey(test);

    return matchKeyToChild(children, key, props);
};

const App = () => (
    <Fragment>
        <Switch test={Math.round(Math.random() * 10)} word="word">
            {{
                0: ({ word }) => <h1>No {word}s</h1>,
                1: ({ word }) => <h1>One {word}</h1>,
                _: ({ test, word }) => (
                    <h1>
                        {test} {word}s
                    </h1>
                )
            }}
        </Switch>
        <Switch test={console.ident(Math.round(Math.random() * 10))}>
            {Array.from({ length: 9 }, (_, i) => <h1 match={i}>{i}</h1>)}
            <h1 matchDefault>Default</h1>
        </Switch>
        <Fetch lazy url="https://api.github.com/users/easilyBaffled">
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
    </Fragment>
);

class Fetch extends React.Component {
    initialState = {
        loading: false,
        data: false,
        error: false
    };

    state = this.initialState;

    fetch = () => {
        this.setState({ ...this.initialState, loading: true }, () =>
            fetch(this.props.url)
                .then(res => {
                    if (res.ok) return res.json();
                    return res.json().then(v => {
                        throw v;
                    });
                })
                .then(data => this.setState({ ...this.initialState, data }))
                .catch(error => {
                    this.setState({ ...this.initialState, error });
                })
        );
    };

    render() {
        return this.props.children({ fetch: this.fetch, ...this.state });
    }
}

// https://codepen.io/easilyBaffled/pen/YLajpX?editors=0010

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
