import { promises as fsp } from 'fs';
import path from 'path';

export async function loadFixture(name: string): Promise<string> {
  const fixtureDir = path.resolve(__dirname, '..', 'fixtures');

  const fixture = await fsp.readFile(path.join(fixtureDir, name), 'utf8');

  return fixture;
}
