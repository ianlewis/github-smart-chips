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

  it("should parse GitHub user profile URLs", () => {
    const url = "https://github.com/ianlewis";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("ianlewis");
    expect(result?.repo).toBeUndefined();
    expect(result?.type).toBe("user");
  });

  it("should parse GitHub user profile URLs with trailing slash", () => {
    const url = "https://github.com/ianlewis/";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("ianlewis");
    expect(result?.repo).toBeUndefined();
    expect(result?.type).toBe("user");
  });

  it("should prioritize repository URLs over user URLs", () => {
    const url = "https://github.com/owner/repo";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("repository");
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
  });

  it("should parse GitHub organization project URLs", () => {
    const url = "https://github.com/orgs/myorg/projects/5";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("myorg");
    expect(result?.org).toBe("myorg");
    expect(result?.number).toBe(5);
    expect(result?.type).toBe("project");
  });

  it("should parse GitHub user project URLs", () => {
    const url = "https://github.com/users/username/projects/3";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("username");
    expect(result?.org).toBeUndefined();
    expect(result?.number).toBe(3);
    expect(result?.type).toBe("project");
  });

  it("should prioritize project URLs over repository URLs", () => {
    const url = "https://github.com/orgs/myorg/projects/1";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("project");
    expect(result?.owner).toBe("myorg");
    expect(result?.number).toBe(1);
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
            name: "repo",
            full_name: "test/repo",
            owner: {
              login: "test",
              avatar_url: "",
              html_url: "",
            },
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
        name: "repo",
        full_name: "test/repo",
        owner: {
          login: "test",
          avatar_url: "",
          html_url: "",
        },
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
      const mockIssueResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            title: "Test Issue",
            number: 123,
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
      const mockRepoResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            name: "repo",
            full_name: "test/repo",
            owner: {
              login: "test",
              avatar_url: "",
              html_url: "",
            },
            private: false,
            stargazers_count: 0,
            forks_count: 0,
            updated_at: "",
            html_url: "",
          }),
      };

      mockUrlFetch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockReturnValueOnce(mockIssueResponse as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockReturnValueOnce(mockRepoResponse as any);

      const result = client.fetchIssue("test", "repo", 123);

      expect(result).toEqual({
        repo: {
          name: "repo",
          full_name: "test/repo",
          owner: {
            login: "test",
            avatar_url: "",
            html_url: "",
          },
          private: false,
          stargazers_count: 0,
          forks_count: 0,
          updated_at: "",
          html_url: "",
        },
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
            number: 456,
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
            repo: {
              name: "repo",
              full_name: "test/repo",
              owner: {
                login: "test",
                avatar_url: "",
                html_url: "",
              },
              private: false,
              stargazers_count: 0,
              forks_count: 0,
              updated_at: "",
              html_url: "",
            },
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchPullRequest("test", "repo", 456);

      expect(result).toEqual({
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
        repo: {
          name: "repo",
          full_name: "test/repo",
          owner: {
            login: "test",
            avatar_url: "",
            html_url: "",
          },
          private: false,
          stargazers_count: 0,
          forks_count: 0,
          updated_at: "",
          html_url: "",
        },
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

  describe("fetchUser", () => {
    it("should fetch user data successfully", () => {
      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            login: "ianlewis",
            avatar_url: "https://avatars.githubusercontent.com/u/123456",
            html_url: "https://github.com/ianlewis",
            name: "Ian Lewis",
            bio: "Software Engineer",
            company: "Example Corp",
            location: "San Francisco, CA",
            blog: "https://example.com",
            public_repos: 50,
            followers: 100,
            following: 75,
            created_at: "2010-01-01T00:00:00Z",
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchUser("ianlewis");

      expect(result).toEqual({
        login: "ianlewis",
        avatar_url: "https://avatars.githubusercontent.com/u/123456",
        html_url: "https://github.com/ianlewis",
        name: "Ian Lewis",
        bio: "Software Engineer",
        company: "Example Corp",
        location: "San Francisco, CA",
        blog: "https://example.com",
        public_repos: 50,
        followers: 100,
        following: 75,
        created_at: "2010-01-01T00:00:00Z",
      });

      expect(mockUrlFetch).toHaveBeenCalledWith(
        "https://api.github.com/users/ianlewis",
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

      const result = client.fetchUser("nonexistentuser");

      expect(result).toBeNull();
    });

    it("should handle API fetch exceptions", () => {
      mockUrlFetch.mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = client.fetchUser("ianlewis");

      expect(result).toBeNull();
    });
  });

  describe("fetchAuthenticatedUser", () => {
    it("should fetch authenticated user data successfully", () => {
      const mockUser = {
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/123",
        html_url: "https://github.com/octocat",
      };

      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify(mockUser),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchAuthenticatedUser();

      expect(result).toEqual(mockUser);
      expect(mockUrlFetch).toHaveBeenCalledWith(
        "https://api.github.com/user",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        }),
      );
    });

    it("should return null when API returns error", () => {
      const mockResponse = {
        getResponseCode: () => 401,
        getContentText: () => "Unauthorized",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchAuthenticatedUser();

      expect(result).toBeNull();
    });

    it("should handle API fetch exceptions", () => {
      mockUrlFetch.mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = client.fetchAuthenticatedUser();

      expect(result).toBeNull();
    });
  });

  describe("fetchProject", () => {
    it("should fetch organization project data successfully", () => {
      const mockProject = {
        number: 5,
        title: "My Project",
        shortDescription: "A test project",
        closed: false,
        public: true,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-06-01T00:00:00Z",
        url: "https://github.com/orgs/testorg/projects/5",
      };

      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            data: {
              organization: {
                projectV2: mockProject,
              },
            },
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchProject("testorg", 5, true);

      expect(result).toEqual(mockProject);
      expect(mockUrlFetch).toHaveBeenCalledWith(
        "https://api.github.com/graphql",
        expect.objectContaining({
          method: "post",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should fetch user project data successfully", () => {
      const mockProject = {
        number: 3,
        title: "Personal Project",
        shortDescription: "My personal project",
        closed: false,
        public: false,
        createdAt: "2023-02-01T00:00:00Z",
        updatedAt: "2023-07-01T00:00:00Z",
        url: "https://github.com/users/testuser/projects/3",
      };

      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            data: {
              user: {
                projectV2: mockProject,
              },
            },
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchProject("testuser", 3, false);

      expect(result).toEqual(mockProject);
    });

    it("should return null when API returns error", () => {
      const mockResponse = {
        getResponseCode: () => 404,
        getContentText: () => "Not Found",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchProject("testorg", 5, true);

      expect(result).toBeNull();
    });

    it("should return null when GraphQL returns errors", () => {
      const mockResponse = {
        getResponseCode: () => 200,
        getContentText: () =>
          JSON.stringify({
            errors: [{ message: "Project not found" }],
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockUrlFetch.mockReturnValue(mockResponse as any);

      const result = client.fetchProject("testorg", 5, true);

      expect(result).toBeNull();
    });

    it("should handle API fetch exceptions", () => {
      mockUrlFetch.mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = client.fetchProject("testorg", 5, true);

      expect(result).toBeNull();
    });
  });
});
