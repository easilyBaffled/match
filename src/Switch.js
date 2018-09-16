import React from 'react';
import { element, func } from 'prop-types';
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
export const Switch_Array = ({ children, testFunc }) => {
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

Switch_Array.propType = {
    children: element,
    testFunc: func
};

/**
 * If the test value is an object then this pulls the key of the first pair with a truthy value.
 * This does not handle Arrays
 * @param {bool|string|number|Object} test
 */
export const extractMatchingKey = test => {
    if (Array.isArray(test))
        throw Error(
            `extractMatchingKey does not accept Arrays and was passed ${test}`
        );
    return isObject(test)
        ? Object.entries(test) // Pull out just the keys that are true
              .concat([[defaultKey, true]])
              .find(([key, bool]) => bool)[0] // [0] without a safety check is ok since at the very least the default will match
        : test;
};

export const matchKeyToChild = (children, key, props) => {
    const child = key in children ? children[key] : children[defaultKey];

    if (!child) return null; // No need to move forward if there was no match and no default

    return typeof child === 'function'
        ? child(props)
        : React.cloneElement(child, props);
};

export default ({ children, withFallThrough, ...props }) => {
    if (Array.isArray(children))
        return Switch_Array({ children, testFunc: isAMatch(props.test) });

    const { test } = props; // test is pulled out here so that it's still a part of props that are passed to the child
    const key = extractMatchingKey(test);

    return matchKeyToChild(children, key, props);
};
