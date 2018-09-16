import { isAMatch, extractMatchingKey, matchKeyToChild } from './Switch';

/**
export const isAMatch = test =>
    isObject(test)
        ? match => typeof match === 'function' ? match(test) : match in test // Match an object key
        : match => typeof match === 'function' ? match(test) : match === test;

 */

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
