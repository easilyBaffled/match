import React, { Fragment } from 'react';
import Switch from '../Switch';

import Fetch from './Fetch';

console.ident = v => (console.log(v), v);

export default () => (
    <Fragment>
        <Switch test={Math.round(Math.random() * 10)}>
            {{
                0: <h1>0</h1>,
                1: <h1>1</h1>,
                _: <h1>Default</h1>
            }}
        </Switch>
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
        <Switch test={Math.round(Math.random() * 10)}>
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

// https://codepen.io/easilyBaffled/pen/YLajpX?editors=0010
