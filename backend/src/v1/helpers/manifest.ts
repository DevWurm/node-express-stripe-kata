import { readFile } from 'fs';
import { resolve as pathResolve } from 'path';

export type VersionInfo = {version: string, date: string, project: string} | {version: string}

export function getVersionInfo(type: 'long' | 'short'): Promise<VersionInfo> {
  return new Promise((resolve, reject) => {
    readFile(pathResolve(__dirname, '../../../manifests/v1.txt'), (err, data) => {
      if (err) { return reject(err); }
      resolve(data);
    });
  })
    .then(content => {
      const lines = content.toString().split(/\r?\n/);

      return lines.reduce((acc, curr) => {
        const [key, value] = curr.split(/:/);
        if ((type == 'long' ? ['version', 'date', 'project'] : ['version']).includes(key)) {
          return Object.assign(acc, {[key]: value.trim()});
        }
        return acc;
      }, {});
    });
}