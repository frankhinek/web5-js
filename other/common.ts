import type { SignatureInput, PublicJwk, PrivateJwk } from '@tbd54566975/dwn-sdk-js';
import { DidKeyResolver, RecordsWrite, DataStream } from '@tbd54566975/dwn-sdk-js';
import { Readable as PolyfilledReadable } from 'readable-stream';
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream';
import fetch from 'node-fetch';

export { Cid, DataStream } from '@tbd54566975/dwn-sdk-js';


export type Profile = {
  did: string;
  keyPair: {
    publicJwk: PublicJwk,
    privateJwk: PrivateJwk
  } ,
  signatureInput: SignatureInput
}

//@ts-expect-error TODO: add reason
const File = globalThis.File ||= class File {}

export function inBrowserOrFilePolyfilled() {
  return !!globalThis.File;
}


export async function createProfile(): Promise<Profile> {
  const { did, keyPair, keyId } = await DidKeyResolver.generate();

  // signatureInput is required by all dwn message classes. it's used to sign messages
  const signatureInput = {
    privateJwk      : keyPair.privateJwk,
    protectedHeader : { alg: keyPair.privateJwk.alg, kid: `${did}#${keyId}` }
  };

  return {
    did,
    keyPair,
    signatureInput
  };
}

export type CreateRecordsWriteOverrides = (
  {
    dataCid?: string;
    dataSize?: number;
    dateCreated?: string;
    published?: boolean;
    recordId?: string
  } & { data?: never })
  |
  ({
    dataCid?: never;
    dataSize?: never;
    dateCreated?: string;
    published?: boolean;
    recordId?: string
  } & { data?: Uint8Array }
);

export async function createRecordsWriteMessage(signer: Profile, overrides: CreateRecordsWriteOverrides = {}) {
  if (!overrides.dataCid && !overrides.data) {
    overrides.data = randomBytes(32);
  }

  const recordsWrite = await RecordsWrite.create({
    ...overrides,
    dataFormat                  : 'application/json',
    authorizationSignatureInput : signer.signatureInput,
  });


  let dataStream;
  if (overrides.data) {
    dataStream = DataStream.fromBytes(overrides.data);
  }

  return {
    recordsWrite,
    dataStream,
    dataBytes: overrides.data
  };
}

export function randomBytes(length: number): Uint8Array {
  const randomBytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }

  return randomBytes;
}

type ObjectWithToJSON = {
  toJSON: () => string;
};

export type RequestOptions = {
  target: string;
  message: ObjectWithToJSON;
  data: unknown;
}


export async function sendRequest(url: string, options: RequestOptions): Promise<void> {
  const { target, message, data } = options;
  
  const jsonRpcPayload = {
    jsonrpc: '2.0',
    method: 'dwn.processMessage',
    params: {
      target: target,
      message: message.toJSON()
    },
    id: Date.now()
  }

  const rpcPayload = JSON.stringify(jsonRpcPayload, null, 2);
  console.log('RPC Payload!!', rpcPayload);

  let requestBody: unknown;
  if (data instanceof Uint8Array) {
    requestBody = new Blob([data]);
  } else if (data instanceof File || (inBrowserOrFilePolyfilled() && data instanceof Blob)) {
    requestBody = data;
  } else if (typeof data['read'] === 'function') {
    requestBody = data;
  } else if (data instanceof ReadableStream) {
    requestBody = new ReadableWebToNodeStream(data);
  } else {
    throw new Error('shrug');
  }

  const resp = await fetch(url, {
    method: 'POST',
    body: requestBody as any,
    headers: {
      'dwn-request': JSON.stringify(jsonRpcPayload)
    }
  });

  console.log(resp.status);
  
  const dataBoi = await resp.json();
  console.log(JSON.stringify(dataBoi, null, 2));
}