import Switch, {
    isAMatch,
    extractMatchingKey,
    matchKeyToChild,
    defaultKey
} from './Switch';
import { mount, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const isAFunction = val => expect(typeof val).toBe('function');
const isIdentity = (val, val2) => expect(val).toBe(val2);
const isNotIdentity = (val, val2) => expect(val).not.toBe(val2);
const isTrue = val => expect(val).toBe(true);
const isFalse = val => expect(val).toBe(false);

const truthyPrimatives = [1, true, 'sting'];
const falsyPrimatives = [0, false, '', undefined, null]; // `typeof null` is technically "object" but `isObject` does not treat it that way
const primatives = [...truthyPrimatives, ...falsyPrimatives];

const truthyObjects = [{ a: 1 }, [1], () => 'string'];
const falsyObjects = [{}, []];
const objects = [...truthyObjects, ...falsyObjects];

describe('isAMatch', () => {
    it('returns a function', () => {
        [...primatives, ...objects].map(isAMatch).forEach(isAFunction);
    });

    it('produces a different function for primatives and objects', () => {
        const primativeFuncs = primatives.map(isAMatch);
        const objFuncs = objects.map(isAMatch);

        primativeFuncs.every(func =>
            primativeFuncs.forEach(f =>
                isIdentity(func.toString(), f.toString())
            )
        );

        objFuncs.every(func =>
            objFuncs.forEach(f => isIdentity(func.toString(), f.toString()))
        );

        primativeFuncs.every(func =>
            objFuncs.forEach(f => isNotIdentity(func.toString(), f.toString()))
        );
    });

    it('Both Matchers call the Match as a function if its a function', () => {
        const spy = jest.fn(() => true);
        const options = [...primatives, ...objects];
        options.map(isAMatch).forEach(matcher => {
            const res = matcher(spy);
            expect(res).toBe(true);
        });

        expect(spy).toHaveBeenCalledTimes(options.length);
    });

    it('Primative Matcher does a === match', () => {
        primatives.map(isAMatch).forEach(matcher => {
            expect(primatives.map(matcher).filter(v => v).length).toBe(1);
        });

        // For == vs === checout http://2ality.com/2011/12/strict-equality-exemptions.html
        expect(isAMatch(1)('1')).toBe(false);
        expect(isAMatch(1)(true)).toBe(false);
        expect(isAMatch(0)(false)).toBe(false);
        expect(isAMatch(null)(undefined)).toBe(false); // would be true for ==
        expect(isAMatch({})({})).toBe(false);
        expect(isAMatch(NaN)(NaN)).toBe(false);
    });

    describe('Object Matcher checks if the key is in the object', () => {
        it('For Arrays', () => {
            isTrue(isAMatch(['val'])(0));
            isFalse(isAMatch(['val'])(1));
        });

        it('For Functions', () => {
            isFalse(isAMatch(() => true)('key'));

            const func = () => false;
            func.key = '';
            isTrue(isAMatch(func)('key'));
        });

        it('For Objects, real objects', () => {
            isFalse(isAMatch({})('key'));
            isFalse(isAMatch({ val: 'key' })('key'));

            const key = 'key';
            isTrue(isAMatch({ key })(key));
            isTrue(isAMatch({ [key]: false })(key));
        });
    });
});

describe('extractMatchingKey', () => {
    it('does not accept Arrays', () => {
        expect(() => extractMatchingKey([])).toThrow();
    });
    describe('Object matching', () => {
        it('will return the default key if there is no match', () => {
            expect(extractMatchingKey({})).toBe(defaultKey);
            expect(extractMatchingKey({ key: false })).toBe(defaultKey);
            expect(extractMatchingKey({ key: 0 })).toBe(defaultKey);
            expect(extractMatchingKey({ key: null })).toBe(defaultKey);
        });
    });
    describe('Primative matching', () => {
        it('null is treated as a primative', () => {
            expect(extractMatchingKey(null)).toBe(null);
        });

        it('will return the value passed in', () => {
            primatives.forEach(v => expect(extractMatchingKey(v)).toBe(v));
        });
    });
});

/*
export const matchKeyToChild = (children, key, props) => {
    if (!isObject(children))
        throw Error(
            `Switch's children must be either an Object or Array instead it recived ${typeof children}`
        );

    const child = key in children ? children[key] : children[defaultKey];

    if (!child) return null; // No need to move forward if there was no match and no default

    return typeof child === 'function'
        ? child(props)
        : React.isValidElement(child)
            ? React.cloneElement(child, props)
            : null;
};
*/

// Trying out new matching system to make it easier to read
// The `it...` functions don't work too well as they obfuscate where the error is coming from
describe('matchKeyToChild', () => {
    const func = (...args) => expect(matchKeyToChild(...args));

    it('will return null if there is no matching key', () => {
        func({}, 'key').toBe(null);
        func({ notKey: true }, 'key').toBe(null);
    });

    it("will return null if the matching value isn't a valid React Element", () => {
        expect(React.isValidElement(1)).toBe(false);
        func({ key: 1 }, 'key').toBe(null);
        expect(React.isValidElement('h1')).toBe(false);
        func({ key: 'h1' }, 'key').toBe(null);
    });

    it('will throw an error if children is not an Object', () => {
        primatives.forEach(v => {
            expect(() => matchKeyToChild(v)).toThrow();
        });
    });

    it('will use the defaultKey if there are no other matches', () => {
        func({
            [defaultKey]: <h1 />
        }).toEqual(<h1 />);
        func({
            true: () => false,
            defaultKey: () => false,
            [defaultKey]: <h1 />
        }).toEqual(<h1 />);
    });

    it('will match to the first key it can find', () => {
        func(
            {
                true: () => <h1 />,
                1: () => false,
                [defaultKey]: false
            },
            true
        ).toEqual(<h1 />);
    });

    it('will call the matching value as a function if it is a function', () => {
        const spy = jest.fn(() => true);
        matchKeyToChild(
            {
                true: spy,
                [defaultKey]: <h1 />
            },
            true
        );
        expect(spy).toHaveBeenCalled();
    });

    it('will pass props to the called function', () => {
        func(
            {
                true: v => v,
                [defaultKey]: <h1 />
            },
            true,
            'value'
        ).toBe('value');
    });

    it('will clone a new element if the matching value was an element', () => {
        const spy = jest.fn(() => true);
        func(
            {
                [defaultKey]: <h1 />
            },
            true
        ).toEqual(<h1 />);
    });

    it('will pass props to the cloned element', () => {
        const H1 = () => <h1 />;
        const initalEl = <H1 />;
        func(
            {
                [defaultKey]: initalEl
            },
            true,
            { text: 'something' }
        ).toEqual(<H1 text="something" />);
    });
});

describe.only('Switch', () => {
    const matched = testVal =>
        mount(
            <Switch test={testVal}>
                {{
                    0: <h1>0</h1>,
                    1: <h1>1</h1>,
                    _: <h1>Default</h1>
                }}
            </Switch>
        );
    it('matches the test prop to a key in the children object', () => {
        expect(matched(0).contains(<h1 test={0}>0</h1>)).toBe(true);
    });
    it('passes test value to the matched child', () => {
        expect(matched(1).contains(<h1 test={1}>1</h1>)).toBe(true);
        expect(matched(1).contains(<h1>1</h1>)).toBe(false);
    });
    it('matches to the default if there is no match', () => {
        expect(matched(3).contains(<h1 test={3}>Default</h1>)).toBe(true);
        expect(matched().contains(<h1 test={undefined}>Default</h1>)).toBe(
            true
        );
    });
    it('passes all props to the matched child', () => {
        expect(
            mount(
                <Switch val="val">
                    {{
                        _: <h1>Default</h1>
                    }}
                </Switch>
            ).contains(
                <h1 test={undefined} val="val">
                    Default
                </h1>
            )
        ).toBe(true);
    });
});
