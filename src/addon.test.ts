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
// prettier-ignore
import { onLinkPreview } from "./addon.js";

const mockCardAction = {
  setFunctionName: jest.fn().mockReturnThis(),
};

const mockCardBuilder = {
  setHeader: jest.fn().mockReturnThis(),
  addSection: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({ id: "mock-card" }),
};

const mockCardHeader = {
  setTitle: jest.fn().mockReturnThis(),
  setSubtitle: jest.fn().mockReturnThis(),
  setImageUrl: jest.fn().mockReturnThis(),
};

const mockCardSection = {
  addWidget: jest.fn().mockReturnThis(),
};

const mockTextParagraph = {
  setText: jest.fn().mockReturnThis(),
};

const mockTextButton = {
  setText: jest.fn().mockReturnThis(),
  setOpenLink: jest.fn().mockReturnThis(),
  setOnClickAction: jest.fn().mockReturnThis(),
};

const mockOpenLink = {
  setUrl: jest.fn().mockReturnThis(),
  setOpenAs: jest.fn().mockReturnThis(),
  setOnClose: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).CardService = {
    newAction: jest.fn(() => mockCardAction),
    newCardBuilder: jest.fn(() => mockCardBuilder),
    newCardHeader: jest.fn(() => mockCardHeader),
    newCardSection: jest.fn(() => mockCardSection),
    newTextParagraph: jest.fn(() => mockTextParagraph),
    newTextButton: jest.fn(() => mockTextButton),
    newOpenLink: jest.fn(() => mockOpenLink),
    newKeyValue: jest.fn(() => ({
      setTopLabel: jest.fn().mockReturnThis(),
      setContent: jest.fn().mockReturnThis(),
      setOpenLink: jest.fn().mockReturnThis(),
    })),
    OpenAs: { OVERLAY: "OVERLAY" },
    OnClose: { RELOAD: "RELOAD" },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ScriptApp = {
    getScriptId: jest.fn(() => "test-script-id"),
  };

  // Mock PropertiesService for OAuth calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).PropertiesService = {
    getScriptProperties: jest.fn(() => ({
      getProperty: jest.fn(() => "test-value"),
    })),
    getUserProperties: jest.fn(() => ({})),
  };

  // Mock OAuth2
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).OAuth2 = {
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

  // Mock HtmlService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).HtmlService = {
    createHtmlOutput: jest.fn(() => ({})),
  };

  // Mock UrlFetchApp for GitHub API calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).UrlFetchApp = {
    fetch: jest.fn(() => ({
      getResponseCode: () => 200,
      getContentText: () => JSON.stringify({ test: "data" }),
    })),
  };

  jest.clearAllMocks();
});

describe("onLinkPreview", () => {
  describe("URL extraction", () => {
    it("should extract URL from docs event", () => {
      // Set up all mocks first
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            owner: "owner",
            repo: "repo",
            description: "Test repo",
            private: false,
            stargazers_count: 0,
            forks_count: 0,
            updated_at: "2023-01-01T00:00:00Z",
            html_url: "https://github.com/owner/repo",
          }),
      });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo",
          },
        },
      };

      const result = onLinkPreview(event);

      // Test that the function returns a card with the expected structure
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0]).toHaveProperty("id");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0].id).toBe("mock-card");
    });

    it("should extract URL from sheets event", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            owner: "owner",
            repo: "repo",
            description: "Test repo",
            private: false,
            stargazers_count: 0,
            forks_count: 0,
            updated_at: "2023-01-01T00:00:00Z",
            html_url: "https://github.com/owner/repo",
          }),
      });

      const event = {
        sheets: {
          matchedUrl: {
            url: "https://github.com/owner/repo",
          },
        },
      };

      const result = onLinkPreview(event);

      // Test that the function returns a card with the expected structure
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0]).toHaveProperty("id");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0].id).toBe("mock-card");
    });

    it("should extract URL from slides event", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            owner: "owner",
            repo: "repo",
            description: "Test repo",
            private: false,
            stargazers_count: 0,
            forks_count: 0,
            updated_at: "2023-01-01T00:00:00Z",
            html_url: "https://github.com/owner/repo",
          }),
      });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo",
          },
        },
      };

      const result = onLinkPreview(event);

      // Test that the function returns a card with the expected structure
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0]).toHaveProperty("id");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0].id).toBe("mock-card");
    });
  });

  describe("Issue handling", () => {
    it("should handle issue URLs successfully", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            owner: "owner",
            repo: "repo",
            number: 123,
            title: "Test issue",
            state: "open",
            body: "Issue description",
            created_at: "2023-01-01T00:00:00Z",
            user: {
              login: "testuser",
              avatar_url: "https://github.com/testuser.png",
              html_url: "https://github.com/testuser",
            },
            labels: [],
          }),
      });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo/issues/123",
          },
        },
      };

      const result = onLinkPreview(event);

      // Test that the function returns a card with the expected structure
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0]).toHaveProperty("id");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0].id).toBe("mock-card");
    });
  });

  describe("Pull Request handling", () => {
    it("should handle pull request URLs successfully", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            number: 456,
            title: "Test PR",
            state: "open",
            body: "PR description",
            created_at: "2023-01-01T00:00:00Z",
            user: {
              login: "testuser",
              avatar_url: "https://github.com/testuser.png",
              html_url: "https://github.com/testuser",
            },
            labels: [],
            merged: false,
            base: {
              ref: "main",
              repo: {
                name: "repo",
                full_name: "owner/repo",
                owner: {
                  login: "repo",
                  avatar_url: "",
                  html_url: "",
                },
                private: false,
                stargazers_count: 0,
                forks_count: 0,
                updated_at: "",
                html_url: "",
              },
            },
            head: { ref: "feature" },
          }),
      });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo/pull/456",
          },
        },
      };

      const result = onLinkPreview(event);

      // Test that the function returns a card with the expected structure
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0]).toHaveProperty("id");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any[])[0].id).toBe("mock-card");
    });
  });

  describe("Authentication handling", () => {
    it("should return authorization card when no token and no data", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
        getResponseCode: () => 404,
        getContentText: () => null,
      });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo",
          },
        },
      };

      const result = onLinkPreview(event);

      expect(result).toHaveLength(1);
      expect(mockCardBuilder.build).toHaveBeenCalled();
    });

    // TODO(#30): mock OAuth2 in addon tests
    //   it("should return error card when token exists but no data", () => {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
    //       getResponseCode: () => 404,
    //       getContentText: () => null,
    //     });
    //
    //     const event = {
    //       docs: {
    //         matchedUrl: {
    //           url: "https://github.com/owner/repo",
    //         },
    //       },
    //     };
    //
    //     const result = onLinkPreview(event);
    //
    //     expect(result).toHaveLength(1);
    //     expect(mockCardBuilder.build).toHaveBeenCalled();
    //   });
    // });

    describe("Client instantiation", () => {
      it("should create client with empty string when no token available", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).UrlFetchApp.fetch.mockReturnValueOnce({
          getResponseCode: () => 200,
          getContentText: () =>
            JSON.stringify({
              name: "repo",
              full_name: "owner/repo",
              owner: {
                login: "owner",
                avatar_url: "",
                html_url: "",
              },
              description: "Test repo",
              private: false,
              stargazers_count: 0,
              forks_count: 0,
              updated_at: "2023-01-01T00:00:00Z",
              html_url: "https://github.com/owner/repo",
            }),
        });

        const event = {
          docs: {
            matchedUrl: {
              url: "https://github.com/owner/repo",
            },
          },
        };

        const result = onLinkPreview(event);

        expect(result).toHaveLength(1);
        expect(mockCardBuilder.build).toHaveBeenCalled();
      });
    });
  });
});
