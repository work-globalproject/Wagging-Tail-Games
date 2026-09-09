import { rm } from 'node:fs/promises';
// Only generated build output, relative to this script's repository root.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
