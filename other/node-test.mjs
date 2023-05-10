import { createProfile, createRecordsWriteMessage, sendRequest } from './dist/common.mjs';
import { getFileAsReadStream } from './dist/node-utils.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
import { ReadStream } from 'fs';

const profile = await createProfile();
const DWN_SERVER_HOST = 'http://localhost:3000';

// __filename and __dirname are not defined in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDataUint8Array() {
  console.log('------ TEST UINT8ARRAY DATA ------');
  const { recordsWrite, dataStream, dataBytes } = await createRecordsWriteMessage(profile);

  await sendRequest(DWN_SERVER_HOST, {
    target: profile.did,
    message: recordsWrite,
    data: dataBytes,
  });
}

async function testDataReadableStream() {
  console.log('------ TEST READABLE DATA ------');
  const { stream, cid, size } = await getFileAsReadStream(`${__dirname}/THOCKDECK_5G.txt`);
  const { recordsWrite } = await createRecordsWriteMessage(profile, { dataSize: size, dataCid: cid  })

  console.log(stream instanceof ReadStream);
  await sendRequest(DWN_SERVER_HOST, {
    target: profile.did,
    message: recordsWrite,
    data: stream,
  });
}

await testDataUint8Array();
await testDataReadableStream();