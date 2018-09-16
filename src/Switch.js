import React, { Fragment } from 'react';

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

export default ({ children, withFallThrough, ...props }) => {
    if (Array.isArray(children))
        return Switch_Array({ children, testFunc: isAMatch(props.test) });

    const { test } = props; // test is pulled out here so that it's still a part of props that are passed to the child
    const key = extractMatchingKey(test);

    return matchKeyToChild(children, key, props);
};
