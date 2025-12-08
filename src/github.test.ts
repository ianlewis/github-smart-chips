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
import { parseGitHubURL, GitHubAPIClient } from "./github.js";

describe("parseGitHubURL", () => {
  it("should parse GitHub issue URLs", () => {
    const url = "https://github.com/owner/repo/issues/123";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(123);
    expect(result?.type).toBe("issue");
  });

  it("should parse GitHub PR URLs", () => {
    const url = "https://github.com/owner/repo/pull/456";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(456);
    expect(result?.type).toBe("pull_request");
  });

  it("should parse GitHub repository URLs", () => {
    const url = "https://github.com/owner/repo";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBeUndefined();
    expect(result?.type).toBe("repository");
  });

  it("should parse GitHub repository URLs with trailing slash", () => {
    const url = "https://github.com/owner/repo/";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.type).toBe("repository");
  });

  it("should parse GitHub repository URLs with additional tree segments", () => {
    const url = "https://github.com/owner/repo/tree/main/src";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.type).toBe("repository");
  });

  it("should parse GitHub repository URLs with additional blob segments", () => {
    const url = "https://github.com/owner/repo/blob/main/src/index.js";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.type).toBe("repository");
  });

  it("should return null for non-GitHub URLs", () => {
    const url = "https://example.com/some/path";
    const result = parseGitHubURL(url);

    expect(result).toBeNull();
  });

  it("should handle issue URLs with additional path segments", () => {
    const url = "https://github.com/owner/repo/issues/123#issuecomment-456";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(123);
    expect(result?.type).toBe("issue");
  });

  it("should handle PR URLs with additional path segments", () => {
    const url = "https://github.com/owner/repo/pull/123#discussion_r2596325999";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(123);
    expect(result?.type).toBe("pull_request");
  });

  it("should prioritize issue URLs over repository URLs", () => {
    const url = "https://github.com/owner/repo/issues/789";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.type).toBe("issue");
    expect(result?.number).toBe(789);
  });

  it("should prioritize PR URLs over repository URLs", () => {
    const url = "https://github.com/owner/repo/pull/101";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.type).toBe("pull_request");
    expect(result?.number).toBe(101);
  });

  it("should return null for malformed GitHub URLs", () => {
    const url = "https://github.com/login/oauth/access_token";
    const result = parseGitHubURL(url);

    expect(result).toBeNull();
  });
});

describe("GitHubAPIClient", () => {
  let mockUrlFetch: jest.MockedFunction<typeof UrlFetchApp.fetch>;
  let client: GitHubAPIClient;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUrlFetch = jest.fn() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).UrlFetchApp = {
      fetch: mockUrlFetch,
    };
    client = new GitHubAPIClient("test-token");
  });

  describe("fetchRepository", () => {
    it("should fetch repository data successfully", () => {
      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            description: "A test repository",
            private: false,
            language: "TypeScript",
            stargazers_count: 10,
            forks_count: 5,
            updated_at: "2023-01-01T00:00:00Z",
            html_url: "https://github.com/test/repo",
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchRepository("test", "repo");

      expect(result).toEqual({
        owner: "test",
        repo: "repo",
        description: "A test repository",
        private: false,
        language: "TypeScript",
        stargazers_count: 10,
        forks_count: 5,
        updated_at: "2023-01-01T00:00:00Z",
        html_url: "https://github.com/test/repo",
      });

      expect(mockUrlFetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/test/repo",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "Bearer test-token",
          },
          muteHttpExceptions: true,
        },
      );
    });

    it("should return null when API returns error", () => {
      const mockResponse = {
        getResponseCode: () => 404,
        getContentText: () => "Not Found",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchRepository("test", "repo");

      expect(result).toBeNull();
    });

    it("should handle API fetch exceptions", () => {
      mockUrlFetch.mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = client.fetchRepository("test", "repo");

      expect(result).toBeNull();
    });

    it("should not include Authorization header when no token provided", () => {
      const clientWithoutToken = new GitHubAPIClient("");
      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({}),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      clientWithoutToken.fetchRepository("test", "repo");

      expect(mockUrlFetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/test/repo",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          muteHttpExceptions: true,
        },
      );
    });
  });

  describe("fetchIssue", () => {
    it("should fetch issue data successfully", () => {
      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            title: "Test Issue",
            state: "open",
            body: "Issue description",
            created_at: "2023-01-01T00:00:00Z",
            user: {
              login: "testuser",
              avatar_url: "https://github.com/testuser.png",
              html_url: "https://github.com/testuser",
            },
            labels: [{ name: "bug", color: "red" }],
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchIssue("test", "repo", 123);

      expect(result).toEqual({
        owner: "test",
        repo: "repo",
        number: 123,
        title: "Test Issue",
        state: "open",
        body: "Issue description",
        created_at: "2023-01-01T00:00:00Z",
        user: {
          login: "testuser",
          avatar_url: "https://github.com/testuser.png",
          html_url: "https://github.com/testuser",
        },
        labels: [{ name: "bug", color: "red" }],
      });
    });

    it("should return null when API returns error", () => {
      const mockResponse = {
        getResponseCode: () => 404,
        getContentText: () => "Not Found",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchIssue("test", "repo", 123);

      expect(result).toBeNull();
    });
  });

  describe("fetchPullRequest", () => {
    it("should fetch pull request data successfully", () => {
      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
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
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchPullRequest("test", "repo", 456);

      expect(result).toEqual({
        owner: "test",
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
    });

    it("should return null when API returns error", () => {
      const mockResponse = {
        getResponseCode: () => 403,
        getContentText: () => "Forbidden",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchPullRequest("test", "repo", 456);

      expect(result).toBeNull();
    });
  });
});
