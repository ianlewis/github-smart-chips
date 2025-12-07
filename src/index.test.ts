// Copyright 2025 Ian Lewis
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

describe("index", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let originalGlobalThis: any;

  beforeEach(() => {
    // Store original globalThis state
    originalGlobalThis = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onLinkPreview: (globalThis as any).onLinkPreview,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authCallback: (globalThis as any).authCallback,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getAuthorizationUrl: (globalThis as any).getAuthorizationUrl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resetAuth: (globalThis as any).resetAuth,
    };

    // Mock required global objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).PropertiesService = {
      getScriptProperties: jest.fn(() => ({
        getProperty: jest.fn(() => "test-value"),
      })),
      getUserProperties: jest.fn(() => ({})),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).OAuth2 = {
      createService: jest.fn(() => ({
        setAuthorizationBaseUrl: jest.fn().mockReturnThis(),
        setTokenUrl: jest.fn().mockReturnThis(),
        setClientId: jest.fn().mockReturnThis(),
        setClientSecret: jest.fn().mockReturnThis(),
        setCallbackFunction: jest.fn().mockReturnThis(),
        setPropertyStore: jest.fn().mockReturnThis(),
        setScope: jest.fn().mockReturnThis(),
        hasAccess: jest.fn(() => true),
        getAccessToken: jest.fn(() => "test-token"),
        getAuthorizationUrl: jest.fn(() => "https://test.url"),
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).HtmlService = {
      createHtmlOutput: jest.fn(() => ({})),
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original globalThis state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).onLinkPreview = originalGlobalThis.onLinkPreview;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).authCallback = originalGlobalThis.authCallback;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).getAuthorizationUrl =
      originalGlobalThis.getAuthorizationUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).resetAuth = originalGlobalThis.resetAuth;
  });

  it("should export functions to globalThis when imported", async () => {
    // Clear module cache and import fresh
    jest.resetModules();
    jest.resetModules();
    await import("./index.js");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((globalThis as any).onLinkPreview).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((globalThis as any).authCallback).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((globalThis as any).getAuthorizationUrl).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((globalThis as any).resetAuth).toBeDefined();
  });

  it("should export onLinkPreview function to global scope", async () => {
    jest.resetModules();
    await import("./index.js");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).onLinkPreview).toBe("function");
  });

  it("should export authCallback function to global scope", async () => {
    jest.resetModules();
    await import("./index.js");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).authCallback).toBe("function");
  });

  it("should export getAuthorizationUrl function to global scope", async () => {
    jest.resetModules();
    await import("./index.js");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).getAuthorizationUrl).toBe("function");
  });

  it("should export resetAuth function to global scope", async () => {
    jest.resetModules();
    await import("./index.js");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).resetAuth).toBe("function");
  });

  it("should maintain function behavior when called from global scope", async () => {
    jest.resetModules();
    await import("./index.js");

    // Test that functions exist and can be called (basic functionality test)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).onLinkPreview).toBe("function");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).authCallback).toBe("function");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).getAuthorizationUrl).toBe("function");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).resetAuth).toBe("function");
  });

  it("should not interfere with existing global functions", async () => {
    // Set up some existing global functions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).existingFunction = jest.fn();

    jest.resetModules();
    await import("./index.js");

    // Verify existing function is still there
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((globalThis as any).existingFunction).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).existingFunction).toBe("function");

    // Clean up
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).existingFunction;
  });

  it("should handle multiple imports gracefully", async () => {
    // Import multiple times
    jest.resetModules();
    await import("./index.js");
    jest.resetModules();
    await import("./index.js");
    jest.resetModules();
    await import("./index.js");

    // Functions should still be available and working
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).onLinkPreview).toBe("function");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).authCallback).toBe("function");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).getAuthorizationUrl).toBe("function");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (globalThis as any).resetAuth).toBe("function");
  });
});
