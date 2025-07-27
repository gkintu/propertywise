// Jest setup file for polyfills and global configurations
// This runs before each test file and before jest-dom setup

// Polyfill TextEncoder/TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require('util');

// Add Node.js polyfills to global scope
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch if not available
if (!global.fetch) {
  global.fetch = jest.fn();
}

// Mock FormData if not available
if (!global.FormData) {
  global.FormData = class FormData {
    constructor() {
      this.data = new Map();
    }
    
    append(key, value) {
      this.data.set(key, value);
    }
    
    get(key) {
      return this.data.get(key);
    }
    
    has(key) {
      return this.data.has(key);
    }
  };
}

// Mock File constructor
if (!global.File) {
  global.File = class File {
    constructor(bits, name, options = {}) {
      this.bits = bits;
      this.name = name;
      this.type = options.type || '';
      this.lastModified = options.lastModified || Date.now();
      this.size = bits.reduce((acc, bit) => acc + (bit.length || bit.size || 0), 0);
    }
  };
}

// Mock Blob constructor
if (!global.Blob) {
  global.Blob = class Blob {
    constructor(bits = [], options = {}) {
      this.bits = bits;
      this.type = options.type || '';
      this.size = bits.reduce((acc, bit) => acc + (bit.length || bit.size || 0), 0);
    }
  };
}

// Mock URL.createObjectURL and revokeObjectURL
if (typeof global.URL === 'undefined') {
  global.URL = {};
}

if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
}

if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = jest.fn();
}
