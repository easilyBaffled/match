import React from 'react';
import { storiesOf } from '@storybook/react';
import Match from '../Match';
import Fetch from '../example/Fetch';


storiesOf('Match', module)
    .add('Some Numbers', () => (
        <Match test={Math.round(Math.random() * 10)}>
            {{
                0: <h1>0</h1>,
                1: <h1>1</h1>,
                _: <h1>Default</h1>
            }}
        </Match>
    ))
    .add('Word', () => (
        <Match test={Math.round(Math.random() * 10)} word="word">
            {{
                0: ({ word }) => <h1>No {word}s</h1>,
                1: ({ word }) => <h1>One {word}</h1>,
                _: ({ test, word }) => (
                    <h1>
                        {test} {word}s
                    </h1>
                )
            }}
        </Match>
    ))
    .add( 'Array of Children', () =>
        <Match test={Math.round(Math.random() * 10)}>
            {Array.from({ length: 9 }, (_, i) => <h1 match={i}>{i}</h1>)}
            <h1 matchDefault>Default</h1>
        </Match>
    )
    .add( 'Fetch', () =>
        <Fetch lazy url="https://api.github.com/users/easilyBaffled">
            {({ loading, fetch, data, error }) => (
                <div>
                    <button onClick={fetch}>Load Data</button>
                    <Match test={{ loading, data, error }}>
                        {{
                            data: ({ test }) => (
                                <pre>{JSON.stringify(test.data, null, 2)}</pre>
                            ),
                            loading: () => <h1>...Loading</h1>,
                            error: ({ test }) => <h1>{test.error.message}</h1>
                        }}
                    </Match>
                </div>
            )}
        </Fetch>
    );
