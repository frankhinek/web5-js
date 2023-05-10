import fs from 'node:fs';
import { Cid } from "./common.js";

export async function getFileAsReadStream(absoluteFilePath: string): Promise<{ stream: fs.ReadStream, cid: string, size: number }> {
  let readStream = fs.createReadStream(absoluteFilePath);
  const cid = await Cid.computeDagPbCidFromStream(readStream as any);

  let size = 0;
  readStream = fs.createReadStream(absoluteFilePath);
  readStream.on('data', chunk => {
    size += chunk['byteLength'];
  });

  return new Promise(resolve => {
    readStream.on('close', () => {
      return resolve({
        stream: fs.createReadStream(absoluteFilePath),
        cid,
        size
      });
    });
  });
}