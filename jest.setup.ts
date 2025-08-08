// Optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.mjs`

// Used for __tests__/testing-library.ts
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';

// Add Node.js polyfills to global scope
Object.assign(global, {
  TextEncoder: TextEncoder,
  TextDecoder: TextDecoder,
});

// Mock fetch for testing
Object.assign(global, {
  fetch: jest.fn(),
});

// Mock URL constructor and methods for testing
const mockCreateObjectURL = jest.fn(() => 'mock-url');
const mockRevokeObjectURL = jest.fn();

Object.assign(global, {
  URL: class MockURL {
    constructor(public href: string, base?: string) {
      if (base) {
        this.href = new URL(href, base).href;
      }
    }
    
    static createObjectURL = mockCreateObjectURL;
    static revokeObjectURL = mockRevokeObjectURL;
  },
});

// Mock the 'sonner' toast API globally for tests
jest.mock('sonner', () => {
  const toastId = 'pdf-generation';
  return {
    Toaster: () => null,
    toast: {
      loading: jest.fn(() => toastId),
      success: jest.fn(),
      error: jest.fn(),
      dismiss: jest.fn(),
    },
  };
});

// Ensure @react-pdf/renderer uses manual mock
jest.mock('@react-pdf/renderer');
