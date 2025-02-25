import type { DwnServiceEndpoint } from '../src/types.js';

import { expect } from 'chai';

import { DidIonApi } from '../src/did-ion.js';

describe('Tech Preview', function () {
  describe('generateDwnConfiguration()', () => {
    it('returns keys and services with two DWN URLs', async () => {
      const ionCreateOptions = await DidIonApi.generateDwnConfiguration([
        'https://dwn.tbddev.test/dwn0',
        'https://dwn.tbddev.test/dwn1'
      ]);

      expect(ionCreateOptions).to.have.property('keys');
      expect(ionCreateOptions.keys).to.have.lengthOf(2);
      let encryptionKey = ionCreateOptions.keys!.find(key => key.id === 'enc');
      expect(encryptionKey).to.exist;
      let authorizationKey = ionCreateOptions.keys!.find(key => key.id === 'authz');
      expect(authorizationKey).to.exist;

      expect(ionCreateOptions).to.have.property('services');
      expect(ionCreateOptions.services).to.have.lengthOf(1);

      const [ service ] = ionCreateOptions.services!;
      expect(service.id).to.equal('dwn');
      expect(service).to.have.property('serviceEndpoint');

      const serviceEndpoint = service.serviceEndpoint as DwnServiceEndpoint;
      expect(serviceEndpoint).to.have.property('nodes');
      expect(serviceEndpoint.nodes).to.have.lengthOf(2);
      expect(serviceEndpoint).to.have.property('messageAuthorizationKeys');
      expect(serviceEndpoint!.messageAuthorizationKeys![0]).to.equal(`#${authorizationKey!.id}`);
      expect(serviceEndpoint).to.have.property('recordEncryptionKeys');
      expect(serviceEndpoint!.recordEncryptionKeys![0]).to.equal(`#${encryptionKey!.id}`);
    });

    it('returns keys and services with one DWN URLs', async () => {
      const ionCreateOptions = await DidIonApi.generateDwnConfiguration([
        'https://dwn.tbddev.test/dwn0'
      ]);

      const [ service ] = ionCreateOptions.services!;
      expect(service.id).to.equal('dwn');
      expect(service).to.have.property('serviceEndpoint');

      const serviceEndpoint = service.serviceEndpoint as DwnServiceEndpoint;
      expect(serviceEndpoint).to.have.property('nodes');
      expect(serviceEndpoint.nodes).to.have.lengthOf(1);
      expect(serviceEndpoint).to.have.property('messageAuthorizationKeys');
      expect(serviceEndpoint).to.have.property('recordEncryptionKeys');
    });

    it('returns keys and services with 0 DWN URLs', async () => {
      const ionCreateOptions = await DidIonApi.generateDwnConfiguration([]);

      const [ service ] = ionCreateOptions.services!;
      expect(service.id).to.equal('dwn');
      expect(service).to.have.property('serviceEndpoint');

      const serviceEndpoint = service.serviceEndpoint as DwnServiceEndpoint;
      expect(serviceEndpoint).to.have.property('nodes');
      expect(serviceEndpoint.nodes).to.have.lengthOf(0);
      expect(serviceEndpoint).to.have.property('messageAuthorizationKeys');
      expect(serviceEndpoint).to.have.property('recordEncryptionKeys');
    });
  });
});