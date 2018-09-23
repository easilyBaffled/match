import React from 'react';
import {
    element,
    string,
    number,
    bool,
    func,
    oneOfType,
    array,
    object
} from 'prop-types';

import _match from './';

// Pulled from lodash https://github.com/lodash/lodash/blob/4.17.10/lodash.js#L11742
// rather than brining in the library itself
function isObject(value) {
    var type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}

// At somepoint this will be made to a prop that the user can set
export const defaultKey = '_';

// Prettier tries to wrap the inner ternaries in `( )` which screws up the parsing order
// See https://stackoverflow.com/questions/48309694/why-cant-i-use-a-ternary-operator-and-arrow-function-in-this-way-in-jsx?rq=1
// prettier-ignore
export const isAMatch = test =>
    isObject(test)
        ? match => typeof match === 'function' ? match(test) : match in test // Match an object key
        : match => typeof match === 'function' ? match(test) : match === test;

// children must be elements
export const Match_Array = ({ children, testFunc }) => {
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

Match_Array.propType = {
    children: element,
    testFunc: func
};

const Match = ({ children, defaultKey = '_', matchAll = false, ...props }) => {
    // keep test in props so that it can ( easily ) be passed to the rendered component

    if (Array.isArray(children))
        return Match_Array({ children, testFunc: isAMatch(props.test) });

    const matchingValue = _match( children, defaultKey )( props.test, matchAll );

    if (!matchingValue) return matchingValue;

    return typeof matchingValue === 'function'
        ? matchingValue(props)
        : React.cloneElement(matchingValue, props);
};

Match.propType = {
    children: oneOfType([object, array]),
    test: oneOfType([string, number, func, bool, object])
};

export default Match;
