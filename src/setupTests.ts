// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Setup fake-indexeddb for IndexedDB tests
import 'fake-indexeddb/auto';

// Polyfill crypto.randomUUID for Node.js < 15
/* eslint-disable @typescript-eslint/no-var-requires */
if (typeof crypto === 'undefined' || !crypto.randomUUID) {
  const nodeCrypto = require('crypto');
  global.crypto = {
    ...global.crypto,
    randomUUID: () => nodeCrypto.randomUUID(),
  } as Crypto;
}
/* eslint-enable @typescript-eslint/no-var-requires */

// Polyfill structuredClone for Node.js < 17
// This is a simplified version that handles basic cloning including Dates
if (typeof structuredClone === 'undefined') {
  global.structuredClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => global.structuredClone(item)) as T;
    }

    const cloned: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = global.structuredClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned as T;
  };
}
