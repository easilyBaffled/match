import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

console.ident = v => (console.log(v), v);

function isObject(value) {
    var type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

const defaultKey = '_';

const isAMatch = test =>
    isObject(test) ? match => match in test : match => test === match;

const Switch_Array = (
    { children, testFunc } // children must be elements
) => {
    const filteredChildren = React.Children.toArray(children).filter(
        child =>
            React.isValidElement(child) &&
            child.props.match &&
            testFunc(child.props.match)
    );
    return filteredChildren.length
        ? filteredChildren
        : React.Children.toArray(children).find(
              child => child.props.matchDefault
          );
};
const Switch = ({ children, withFallThrough, ...props }) => {
    if (!Array.isArray(children)) {
        const { test } = props; // test is pulled out here so that it's still a part of props that are passed to the child
        const key = isObject(test)
            ? Object.entries(test) // Pull out just the keys that are true
                  .concat([[defaultKey, true]])
                  .filter(([key, bool]) => bool)[0][0]
            : test;

        return key in children
            ? typeof children[key] === 'function'
                ? children[key](props)
                : React.cloneElement(children, props)
            : children[defaultKey]
                ? React.cloneElement(children, props)
                : null;
    }

    return Switch_Array({ children, testFunc: isAMatch(test) });
};

const App = ({ pluralizationValue }) => (
    <Fragment>
        <Switch test={pluralizationValue} word="word">
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
ReactDOM.render(<App pluralizationValue={0} />, rootElement);
