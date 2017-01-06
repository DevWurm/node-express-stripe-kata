export type VersionInfo = {version: string, date: string, project: string} | {version: string}

export function getVersionInfo(type: 'long' | 'short'): Promise<VersionInfo> {
 // TODO: Read and parse the manifest file
}