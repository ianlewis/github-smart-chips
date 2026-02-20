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

import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Import after mocking
import {
  getGitHubService,
  authCallback,
  getAccessToken,
  getAuthorizationUrl,
  resetAuth,
} from "./oauth.js";

// Mock dependencies
const mockPropertiesService = {
  getScriptProperties: jest.fn(),
  getUserProperties: jest.fn(),
};

const mockScriptProps = {
  getProperty: jest.fn(),
};

const mockUserProps = {};

const mockOAuth2Service = {
  setAuthorizationBaseUrl: jest.fn().mockReturnThis(),
  setTokenUrl: jest.fn().mockReturnThis(),
  setClientId: jest.fn().mockReturnThis(),
  setClientSecret: jest.fn().mockReturnThis(),
  setCallbackFunction: jest.fn().mockReturnThis(),
  setPropertyStore: jest.fn().mockReturnThis(),
  setScope: jest.fn().mockReturnThis(),
  handleCallback: jest.fn(),
  hasAccess: jest.fn(),
  getAccessToken: jest.fn(),
  getAuthorizationUrl: jest.fn(),
  reset: jest.fn(),
};

const mockOAuth2Lib = {
  createService: jest.fn(() => mockOAuth2Service),
};

const mockHtmlService = {
  createHtmlOutput: jest.fn(),
};

const mockHtmlOutput = {};

beforeEach(() => {
  jest.clearAllMocks();

  // Mock global objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).PropertiesService = mockPropertiesService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).OAuth2 = mockOAuth2Lib;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).HtmlService = mockHtmlService;

  mockPropertiesService.getScriptProperties.mockReturnValue(mockScriptProps);
  mockPropertiesService.getUserProperties.mockReturnValue(mockUserProps);
  mockHtmlService.createHtmlOutput.mockReturnValue(mockHtmlOutput);
});

describe("getGitHubService", () => {
  it("should create OAuth2 service with correct configuration", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });

    const service = getGitHubService();

    expect(mockOAuth2Lib.createService).toHaveBeenCalled();
    expect(mockOAuth2Service.setAuthorizationBaseUrl).toHaveBeenCalledWith(
      "https://github.com/login/oauth/authorize",
    );
    expect(mockOAuth2Service.setTokenUrl).toHaveBeenCalledWith(
      "https://github.com/login/oauth/access_token",
    );
    expect(mockOAuth2Service.setClientId).toHaveBeenCalledWith(
      "test-client-id",
    );
    expect(mockOAuth2Service.setClientSecret).toHaveBeenCalledWith(
      "test-client-secret",
    );
    expect(mockOAuth2Service.setCallbackFunction).toHaveBeenCalledWith(
      "authCallback",
    );
    expect(mockOAuth2Service.setPropertyStore).toHaveBeenCalledWith(
      mockUserProps,
    );
    expect(mockOAuth2Service.setScope).toHaveBeenCalledWith("repo read:project");
    expect(service).toBe(mockOAuth2Service);
  });

  it("should handle missing client ID and secret gracefully", () => {
    mockScriptProps.getProperty.mockReturnValue(null);

    const service = getGitHubService();

    expect(mockOAuth2Service.setClientId).toHaveBeenCalledWith("");
    expect(mockOAuth2Service.setClientSecret).toHaveBeenCalledWith("");
    expect(service).toBe(mockOAuth2Service);
  });

  it("should handle missing client ID only", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return null;
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });

    const service = getGitHubService();

    expect(mockOAuth2Service.setClientId).toHaveBeenCalledWith("");
    expect(mockOAuth2Service.setClientSecret).toHaveBeenCalledWith(
      "test-client-secret",
    );
    expect(service).toBe(mockOAuth2Service);
  });

  it("should handle missing client secret only", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return null;
      return null;
    });

    const service = getGitHubService();

    expect(mockOAuth2Service.setClientId).toHaveBeenCalledWith(
      "test-client-id",
    );
    expect(mockOAuth2Service.setClientSecret).toHaveBeenCalledWith("");
    expect(service).toBe(mockOAuth2Service);
  });
});

describe("authCallback", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });
  });

  it("should return success message when authorization is successful", () => {
    const request = {
      parameter: {
        code: "auth-code",
        state: "state-value",
      },
    };

    mockOAuth2Service.handleCallback.mockReturnValue(true);

    const result = authCallback(request);

    expect(mockOAuth2Service.handleCallback).toHaveBeenCalledWith(request);
    expect(mockHtmlService.createHtmlOutput).toHaveBeenCalledWith(
      "Success! You can close this tab.",
    );
    expect(result).toBe(mockHtmlOutput);
  });

  it("should return denied message when authorization fails", () => {
    const request = {
      parameter: {
        error: "access_denied",
      },
    };

    mockOAuth2Service.handleCallback.mockReturnValue(false);

    const result = authCallback(request);

    expect(mockOAuth2Service.handleCallback).toHaveBeenCalledWith(request);
    expect(mockHtmlService.createHtmlOutput).toHaveBeenCalledWith(
      "Denied. You can close this tab and try again.",
    );
    expect(result).toBe(mockHtmlOutput);
  });

  it("should handle callback with empty parameters", () => {
    const request = {
      parameter: {},
    };

    mockOAuth2Service.handleCallback.mockReturnValue(false);

    const result = authCallback(request);

    expect(mockOAuth2Service.handleCallback).toHaveBeenCalledWith(request);
    expect(result).toBe(mockHtmlOutput);
  });
});

describe("getAccessToken", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });
  });

  it("should return access token when service has access", () => {
    mockOAuth2Service.hasAccess.mockReturnValue(true);
    mockOAuth2Service.getAccessToken.mockReturnValue("access-token-123");

    const token = getAccessToken();

    expect(mockOAuth2Service.hasAccess).toHaveBeenCalled();
    expect(mockOAuth2Service.getAccessToken).toHaveBeenCalled();
    expect(token).toBe("access-token-123");
  });

  it("should return null when service has no access", () => {
    mockOAuth2Service.hasAccess.mockReturnValue(false);

    const token = getAccessToken();

    expect(mockOAuth2Service.hasAccess).toHaveBeenCalled();
    expect(mockOAuth2Service.getAccessToken).not.toHaveBeenCalled();
    expect(token).toBeNull();
  });

  it("should handle undefined access token", () => {
    mockOAuth2Service.hasAccess.mockReturnValue(true);
    mockOAuth2Service.getAccessToken.mockReturnValue(undefined);

    const token = getAccessToken();

    expect(token).toBeUndefined();
  });

  it("should handle empty string access token", () => {
    mockOAuth2Service.hasAccess.mockReturnValue(true);
    mockOAuth2Service.getAccessToken.mockReturnValue("");

    const token = getAccessToken();

    expect(token).toBe("");
  });
});

describe("getAuthorizationUrl", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });
  });

  it("should return authorization URL from OAuth2 service", () => {
    const expectedUrl =
      "https://github.com/login/oauth/authorize?client_id=test-client-id";
    mockOAuth2Service.getAuthorizationUrl.mockReturnValue(expectedUrl);

    const url = getAuthorizationUrl();

    expect(mockOAuth2Service.getAuthorizationUrl).toHaveBeenCalled();
    expect(url).toBe(expectedUrl);
  });

  it("should handle empty authorization URL", () => {
    mockOAuth2Service.getAuthorizationUrl.mockReturnValue("");

    const url = getAuthorizationUrl();

    expect(url).toBe("");
  });

  it("should handle undefined authorization URL", () => {
    mockOAuth2Service.getAuthorizationUrl.mockReturnValue(undefined);

    const url = getAuthorizationUrl();

    expect(url).toBeUndefined();
  });
});

describe("resetAuth", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });
  });

  it("should call reset on OAuth2 service", () => {
    resetAuth();

    expect(mockOAuth2Service.reset).toHaveBeenCalled();
  });

  it("should not throw when reset is called multiple times", () => {
    resetAuth();
    resetAuth();

    expect(mockOAuth2Service.reset).toHaveBeenCalledTimes(2);
  });
});

describe("integration scenarios", () => {
  it("should handle complete OAuth flow", () => {
    // Setup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockScriptProps.getProperty.mockImplementation((key: any) => {
      if (key === "GITHUB_CLIENT_ID") return "test-client-id";
      if (key === "GITHUB_CLIENT_SECRET") return "test-client-secret";
      return null;
    });

    // 1. Get authorization URL
    const authUrl =
      "https://github.com/login/oauth/authorize?client_id=test-client-id";
    mockOAuth2Service.getAuthorizationUrl.mockReturnValue(authUrl);

    const url = getAuthorizationUrl();
    expect(url).toBe(authUrl);

    // 2. Handle callback (success case)
    const request = { parameter: { code: "auth-code" } };
    mockOAuth2Service.handleCallback.mockReturnValue(true);

    authCallback(request);
    expect(mockHtmlService.createHtmlOutput).toHaveBeenCalledWith(
      "Success! You can close this tab.",
    );

    // 3. Get access token
    mockOAuth2Service.hasAccess.mockReturnValue(true);
    mockOAuth2Service.getAccessToken.mockReturnValue("valid-token");

    const token = getAccessToken();
    expect(token).toBe("valid-token");

    // 4. Reset auth
    resetAuth();
    expect(mockOAuth2Service.reset).toHaveBeenCalled();
  });
});
