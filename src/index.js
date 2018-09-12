import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Holen from 'holen';
import './styles.css';

console.ident = v => (console.log(v), v);

function isObject(value) {
    var type = typeof value;
    return value != null && (type === 'object' || type === 'function');
}

const defaultKey = '_';

const isAMatch = test =>
    isObject(test) ? match => match in test : match => test === match;

/*
<Switch test={1}>
        {Array.from({ length: 3 }, (_, i) => <h1 match={i}>{i}</h1>)}
    </Switch>
*/
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
            : React.cloneElement(children, props) || null;
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
        <Holen lazy url="https://api.github.com/users/easilyBaffled">
            {({ fetching, fetch, error, data }) => (
                <div>
                    <button onClick={fetch}>Load Data</button>
                    <Switch test={{ fetching, data, error }}>
                        {{
                            data: ({ test }) => (
                                <pre>
                                    Something{' '}
                                    {JSON.stringify(test.data, null, 2)}
                                </pre>
                            ),
                            fetching: () => <h1>Loading</h1>,
                            error: ({ test }) => <h1>Error</h1>,
                            _: props => props => <h1>Not working</h1>
                        }}
                    </Switch>
                </div>
            )}
        </Holen>
    </Fragment>
);
// https://codepen.io/easilyBaffled/pen/YLajpX?editors=0010

const rootElement = document.getElementById('root');
ReactDOM.render(<App pluralizationValue={0} />, rootElement);
