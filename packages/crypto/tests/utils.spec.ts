import { expect } from 'chai';

import { checkValidProperty, checkRequiredProperty } from '../src/utils.js';

describe('Crypto Utils', () => {
  describe('checkValidProperty()', () => {
    it('throws an error if required arguments are missing', () => {
    // @ts-expect-error because second argument is intentionally omitted.
      expect(() => checkValidProperty({ property: 'foo' })).to.throw('required arguments missing');
      // @ts-expect-error because both arguments are intentionally omitted.
      expect(() => checkValidProperty()).to.throw('required arguments missing');
    });

    it('throws an error if the property does not exist', () => {
      const propertiesCollection = ['foo', 'bar'];
      expect(() => checkValidProperty({ property: 'baz', allowedProperties: propertiesCollection })).to.throw('Out of range');
    });

    it('does not throw an error if the property exists', () => {
      const propertiesCollection = ['foo', 'bar'];
      expect(() => checkValidProperty({ property: 'foo', allowedProperties: propertiesCollection })).to.not.throw();
    });
  });

  describe('checkRequiredProperty', () => {
    it('throws an error if required arguments are missing', () => {
    // @ts-expect-error because second argument is intentionally omitted.
      expect(() => checkRequiredProperty({ property: 'foo' })).to.throw('required arguments missing');
      // @ts-expect-error because both arguments are intentionally omitted.
      expect(() => checkRequiredProperty()).to.throw('required arguments missing');
    });

    it('throws an error if the property is missing', () => {
      const propertiesCollection = { foo: 'bar', baz: 'qux' };
      expect(() => checkRequiredProperty({ property: 'quux', inObject: propertiesCollection })).to.throw('Required parameter was missing');
    });

    it('does not throw an error if the property is present', () => {
      const propertiesCollection = { foo: 'bar', baz: 'qux' };
      expect(() => checkRequiredProperty({ property: 'foo', inObject: propertiesCollection })).to.not.throw();
    });
  });
});