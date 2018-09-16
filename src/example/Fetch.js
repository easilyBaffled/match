import React, { Fragment } from 'react';

export default class Fetch extends React.Component {
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
