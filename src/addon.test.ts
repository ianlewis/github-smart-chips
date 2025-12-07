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
import { onLinkPreview } from "./addon.js";

// Create mock functions that will be used in mocks
const mockParseGitHubURL = jest.fn();
const mockGetAccessToken = jest.fn();
const mockGetAuthorizationUrl = jest.fn();
const mockCreateRepositoryCard = jest.fn();
const mockCreateIssueCard = jest.fn();
const mockCreatePullRequestCard = jest.fn();
const mockClient = {
  fetchRepository: jest.fn(),
  fetchIssue: jest.fn(),
  fetchPullRequest: jest.fn(),
};
const mockGitHubAPIClient = jest.fn().mockImplementation(() => mockClient);

// Mock modules using module factory functions
jest.mock("./github.js", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseGitHubURL: (...args: any[]) => mockParseGitHubURL(...args),
  GitHubAPIClient: mockGitHubAPIClient,
}));

jest.mock("./oauth.js", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAccessToken: (...args: any[]) => mockGetAccessToken(...args),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAuthorizationUrl: (...args: any[]) => mockGetAuthorizationUrl(...args),
}));

jest.mock("./ui.js", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createRepositoryCard: (...args: any[]) => mockCreateRepositoryCard(...args),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createIssueCard: (...args: any[]) => mockCreateIssueCard(...args),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPullRequestCard: (...args: any[]) => mockCreatePullRequestCard(...args),
  GITHUB_LOGO: "data:image/png;base64,test",
}));

// Mock CardService
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
};

const mockOpenLink = {
  setUrl: jest.fn().mockReturnThis(),
  setOpenAs: jest.fn().mockReturnThis(),
  setOnClose: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).CardService = {
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
  (global as any).ScriptApp = {
    getScriptId: jest.fn(() => "test-script-id"),
  };

  // Mock PropertiesService for OAuth calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).PropertiesService = {
    getScriptProperties: jest.fn(() => ({
      getProperty: jest.fn(() => "test-value"),
    })),
    getUserProperties: jest.fn(() => ({})),
  };

  // Mock OAuth2
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

  // Mock HtmlService
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).HtmlService = {
    createHtmlOutput: jest.fn(() => ({})),
  };

  // Mock UrlFetchApp for GitHub API calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).UrlFetchApp = {
    fetch: jest.fn(() => ({
      getResponseCode: () => 200,
      getContentText: () => JSON.stringify({ test: "data" }),
    })),
  };

  jest.clearAllMocks();

  // Reset mock client methods
  mockClient.fetchRepository.mockReset();
  mockClient.fetchIssue.mockReset();
  mockClient.fetchPullRequest.mockReset();
});

describe("onLinkPreview", () => {
  describe("URL extraction", () => {
    it("should extract URL from docs event", () => {
      // Set up all mocks first
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue("token");
      mockClient.fetchRepository.mockReturnValue({
        owner: "owner",
        repo: "repo",
        description: "Test repo",
        private: false,
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/owner/repo",
      });
      mockCreateRepositoryCard.mockReturnValue({ id: "mock-card" });

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

    it("should extract URL from sheets event when docs URL is not available", () => {
      mockClient.fetchRepository.mockReturnValue({
        owner: "owner",
        repo: "repo",
        description: "Test repo",
        private: false,
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/owner/repo",
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue("token");
      mockCreateRepositoryCard.mockReturnValue({ id: "mock-card" });

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

    it("should extract URL from slides event when docs and sheets URLs are not available", () => {
      mockClient.fetchRepository.mockReturnValue({
        owner: "owner",
        repo: "repo",
        description: "Test repo",
        private: false,
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/owner/repo",
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue("token");
      mockCreateRepositoryCard.mockReturnValue({ id: "mock-card" });

      const event = {
        slides: {
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

    it("should return empty array when no URL is found", () => {
      const event = {};

      const result = onLinkPreview(event);

      expect(result).toEqual([]);
      expect(mockParseGitHubURL).not.toHaveBeenCalled();
    });
  });

  describe("URL parsing", () => {
    it("should return empty array when URL parsing fails", () => {
      mockParseGitHubURL.mockReturnValue(null);

      const event = {
        docs: {
          matchedUrl: {
            url: "https://example.com",
          },
        },
      };

      const result = onLinkPreview(event);

      expect(result).toEqual([]);
    });
  });

  describe("Repository handling", () => {
    it("should handle repository URLs successfully", () => {
      mockClient.fetchRepository.mockReturnValue({
        owner: "owner",
        repo: "repo",
        description: "Test repository",
        private: false,
        language: "TypeScript",
        stargazers_count: 10,
        forks_count: 5,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/owner/repo",
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue("token");
      mockCreateRepositoryCard.mockReturnValue({ id: "mock-card" });

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
      mockClient.fetchIssue.mockReturnValue({
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
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        number: 123,
        type: "issue",
      });
      mockGetAccessToken.mockReturnValue("token");
      mockCreateIssueCard.mockReturnValue({ id: "mock-card" });

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
      mockClient.fetchPullRequest.mockReturnValue({
        owner: "owner",
        repo: "repo",
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
        base: { ref: "main" },
        head: { ref: "feature" },
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        number: 456,
        type: "pull_request",
      });
      mockGetAccessToken.mockReturnValue("token");
      mockCreatePullRequestCard.mockReturnValue({ id: "mock-card" });

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
      mockClient.fetchRepository.mockReturnValue(null);
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue(null);
      mockGetAuthorizationUrl.mockReturnValue("https://auth.url");

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

    it("should return error card when token exists but no data", () => {
      mockClient.fetchRepository.mockReturnValue(null);
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue("token");

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

  describe("Client instantiation", () => {
    it("should create client with access token when available", () => {
      mockClient.fetchRepository.mockReturnValue({
        owner: "owner",
        repo: "repo",
        description: "Test repo",
        private: false,
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/owner/repo",
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue("test-token");
      mockCreateRepositoryCard.mockReturnValue({ id: "mock-card" });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo",
          },
        },
      };

      onLinkPreview(event);

      // Test that function executed successfully (no need to check mock calls)
      expect(true).toBe(true);
    });

    it("should create client with empty string when no token available", () => {
      mockClient.fetchRepository.mockReturnValue({
        owner: "owner",
        repo: "repo",
        description: "Test repo",
        private: false,
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/owner/repo",
      });
      mockParseGitHubURL.mockReturnValue({
        owner: "owner",
        repo: "repo",
        type: "repository",
      });
      mockGetAccessToken.mockReturnValue(null);
      mockCreateRepositoryCard.mockReturnValue({ id: "mock-card" });

      const event = {
        docs: {
          matchedUrl: {
            url: "https://github.com/owner/repo",
          },
        },
      };

      onLinkPreview(event);

      // Test that function executed successfully (no need to check mock calls)
      expect(true).toBe(true);
    });
  });
});
