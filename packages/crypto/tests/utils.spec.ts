import { expect } from 'chai';

import { checkPropertyExists, checkRequiredProperty } from '../src/utils.js';

describe('Crypto Utils', () => {
  describe('checkPropertyExists()', () => {
    it('throws an error if required arguments are missing', () => {
    // @ts-expect-error because second argument is intentionally omitted.
      expect(() => checkPropertyExists('foo')).to.throw('required arguments missing');
      // @ts-expect-error because both arguments are intentionally omitted.
      expect(() => checkPropertyExists()).to.throw('required arguments missing');
    });

    it('throws an error if the property does not exist', () => {
      const propertiesCollection = ['foo', 'bar'];
      expect(() => checkPropertyExists('baz', propertiesCollection)).to.throw('Out of range');
    });

    it('does not throw an error if the property exists', () => {
      const propertiesCollection = ['foo', 'bar'];
      expect(() => checkPropertyExists('foo', propertiesCollection)).to.not.throw();
    });
  });

  describe('checkRequiredProperty', () => {
    it('throws an error if required arguments are missing', () => {
    // @ts-expect-error because second argument is intentionally omitted.
      expect(() => checkRequiredProperty('foo')).to.throw('required arguments missing');
      // @ts-expect-error because both arguments are intentionally omitted.
      expect(() => checkRequiredProperty()).to.throw('required arguments missing');
    });

    it('throws an error if the property is missing', () => {
      const propertiesCollection = { foo: 'bar', baz: 'qux' };
      expect(() => checkRequiredProperty('quux', propertiesCollection)).to.throw('Required parameter was missing');
    });

    it('does not throw an error if the property is present', () => {
      const propertiesCollection = { foo: 'bar', baz: 'qux' };
      expect(() => checkRequiredProperty('foo', propertiesCollection)).to.not.throw();
    });
  });
});