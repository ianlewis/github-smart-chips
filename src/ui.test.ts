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

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  createIssueCard,
  createPullRequestCard,
  createRepositoryCard,
  createUserCard,
  createProjectCard,
  createSettingsSidebar,
} from "./ui.js";
import {
  type GitHubRepository,
  type GitHubIssue,
  type GitHubPullRequest,
  type GitHubUser,
  type GitHubProject,
} from "./types.js";
import { GITHUB_LOGO } from "./logos.js";

// Mock CardService
const mockCardBuilder = {
  setHeader: jest.fn().mockReturnThis(),
  addSection: jest.fn().mockReturnThis(),
  build: jest.fn(),
};

const mockCardHeader = {
  setTitle: jest.fn().mockReturnThis(),
  setSubtitle: jest.fn().mockReturnThis(),
  setImageUrl: jest.fn().mockReturnThis(),
};

const mockCardSection = {
  addWidget: jest.fn().mockReturnThis(),
};

const mockKeyValue = {
  setTopLabel: jest.fn().mockReturnThis(),
  setContent: jest.fn().mockReturnThis(),
  setOpenLink: jest.fn().mockReturnThis(),
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
    newCardBuilder: jest.fn(() => mockCardBuilder),
    newCardHeader: jest.fn(() => mockCardHeader),
    newCardSection: jest.fn(() => mockCardSection),
    newKeyValue: jest.fn(() => mockKeyValue),
    newTextParagraph: jest.fn(() => mockTextParagraph),
    newTextButton: jest.fn(() => mockTextButton),
    newOpenLink: jest.fn(() => mockOpenLink),
  };

  // Reset all mocks
  jest.clearAllMocks();
});

// Note: createSmartChip function was removed from ui.ts, so these tests are commented out
// describe("createSmartChip", () => { ... });

describe("createIssueCard", () => {
  it("should create a card for an open issue", () => {
    const data: GitHubIssue = {
      repo: {
        name: "hello-world",
        full_name: "octocat/hello-world",
        owner: {
          login: "octocat",
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
      body: "This is a test issue with a long description that should be truncated",
      created_at: "2023-01-01T00:00:00Z",
      user: {
        login: "testuser",
        avatar_url: "https://github.com/testuser.png",
        html_url: "https://github.com/testuser",
      },
      labels: [
        { name: "bug", color: "red" },
        { name: "urgent", color: "orange" },
      ],
    };

    createIssueCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardBuilder.setHeader).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith(
      "octocat/hello-world#123: Test Issue",
    );
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "🟢 Issue #123 • open",
    );
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(GITHUB_LOGO);
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should create a card for a closed issue", () => {
    const data: GitHubIssue = {
      repo: {
        name: "hello-world",
        full_name: "octocat/hello-world",
        owner: {
          login: "octocat",
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
      title: "Closed Issue",
      state: "closed",
      body: "This issue has been resolved",
      created_at: "2023-01-01T00:00:00Z",
      user: {
        login: "testuser",
        avatar_url: "https://github.com/testuser.png",
        html_url: "https://github.com/testuser",
      },
      labels: [],
    };

    createIssueCard(data);

    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "🔴 Issue #123 • closed",
    );
  });

  it("should handle issue with no body", () => {
    const data: GitHubIssue = {
      repo: {
        name: "hello-world",
        full_name: "octocat/hello-world",
        owner: {
          login: "octocat",
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
      title: "Issue Without Body",
      state: "open",
      created_at: "2023-01-01T00:00:00Z",
      user: {
        login: "testuser",
        avatar_url: "https://github.com/testuser.png",
        html_url: "https://github.com/testuser",
      },
      labels: [],
    };

    createIssueCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });
});

describe("createPullRequestCard", () => {
  it("should create a card for an open pull request", () => {
    const data: GitHubPullRequest = {
      number: 456,
      title: "Test PR",
      state: "open",
      body: "This is a test pull request description",
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
          name: "hello-world",
          full_name: "octocat/hello-world",
          owner: {
            login: "octocat",
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
      head: {
        ref: "feature-branch",
        repo: {
          name: "hello-world",
          full_name: "octocat/hello-world",
          owner: {
            login: "octocat",
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
    };

    createPullRequestCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith(
      "octocat/hello-world#456: Test PR",
    );
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "🟢 Pull Request #456 • open",
    );
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(GITHUB_LOGO);
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should create a card for a merged pull request", () => {
    const data: GitHubPullRequest = {
      number: 456,
      title: "Merged PR",
      state: "closed",
      body: "This PR was merged",
      created_at: "2023-01-01T00:00:00Z",
      user: {
        login: "testuser",
        avatar_url: "https://github.com/testuser.png",
        html_url: "https://github.com/testuser",
      },
      labels: [],
      merged: true,
      base: {
        ref: "main",
        repo: {
          name: "hello-world",
          full_name: "octocat/hello-world",
          owner: {
            login: "octocat",
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
      head: {
        ref: "feature-branch",
        repo: {
          name: "hello-world",
          full_name: "octocat/hello-world",
          owner: {
            login: "octocat",
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
    };

    createPullRequestCard(data);

    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "🟣 Pull Request #456 • closed",
    );
  });

  it("should create a card for a closed but not merged pull request", () => {
    const data: GitHubPullRequest = {
      number: 456,
      title: "Closed PR",
      state: "closed",
      body: "This PR was closed without merging",
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
          name: "hello-world",
          full_name: "octocat/hello-world",
          owner: {
            login: "octocat",
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
      head: {
        ref: "feature-branch",
        repo: {
          name: "hello-world",
          full_name: "octocat/hello-world",
          owner: {
            login: "octocat",
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
    };

    createPullRequestCard(data);

    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "🔴 Pull Request #456 • closed",
    );
  });
});

describe("createRepositoryCard", () => {
  it("should create a card for a public repository", () => {
    const data: GitHubRepository = {
      name: "hello-world",
      full_name: "octocat/hello-world",
      description: "A test repository",
      owner: {
        login: "octocat",
        avatar_url: "",
        html_url: "",
      },
      private: false,
      language: "TypeScript",
      stargazers_count: 100,
      forks_count: 25,
      updated_at: "2023-01-01T00:00:00Z",
      html_url: "https://github.com/octocat/hello-world",
    };

    createRepositoryCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("octocat/hello-world");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "A test repository",
    );
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(GITHUB_LOGO);
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should create a card for a private repository", () => {
    const data: GitHubRepository = {
      name: "private-repo",
      full_name: "octocat/private-repo",
      description: "A private repository",
      owner: {
        login: "octocat",
        avatar_url: "",
        html_url: "",
      },
      private: true,
      language: "JavaScript",
      stargazers_count: 5,
      forks_count: 1,
      updated_at: "2023-01-01T00:00:00Z",
      html_url: "https://github.com/octocat/private-repo",
    };

    createRepositoryCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should handle repository with no description", () => {
    const data: GitHubRepository = {
      name: "no-desc-repo",
      full_name: "octocat/no-desc-repo",
      owner: {
        login: "octocat",
        avatar_url: "",
        html_url: "",
      },
      private: false,
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2023-01-01T00:00:00Z",
      html_url: "https://github.com/octocat/no-desc-repo",
    };

    createRepositoryCard(data);

    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "GitHub Repository",
    );
  });

  it("should handle repository with no language", () => {
    const data: GitHubRepository = {
      name: "no-lang-repo",
      full_name: "octocat/no-lang-repo",
      description: "Repository without main language",
      owner: {
        login: "octocat",
        avatar_url: "",
        html_url: "",
      },
      private: false,
      stargazers_count: 0,
      forks_count: 0,
      updated_at: "2023-01-01T00:00:00Z",
      html_url: "https://github.com/octocat/no-lang-repo",
    };

    createRepositoryCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });
});

describe("createUserCard", () => {
  it("should create a card for a user with full profile information", () => {
    const data: GitHubUser = {
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
    };

    createUserCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith(
      "ianlewis (Ian Lewis)",
    );
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "Software Engineer",
    );
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(
      "https://avatars.githubusercontent.com/u/123456",
    );
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should create a card for a user with minimal information", () => {
    const data: GitHubUser = {
      login: "testuser",
      avatar_url: "https://avatars.githubusercontent.com/u/789",
      html_url: "https://github.com/testuser",
    };

    createUserCard(data);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("testuser");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith("GitHub User");
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should handle user with no avatar", () => {
    const data: GitHubUser = {
      login: "noavatar",
      avatar_url: "",
      html_url: "https://github.com/noavatar",
      name: "No Avatar User",
    };

    createUserCard(data);

    expect(mockCardHeader.setTitle).toHaveBeenCalledWith(
      "noavatar (No Avatar User)",
    );
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(GITHUB_LOGO);
  });

  it("should handle user with no name", () => {
    const data: GitHubUser = {
      login: "username",
      avatar_url: "https://avatars.githubusercontent.com/u/123",
      html_url: "https://github.com/username",
    };

    createUserCard(data);

    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("username");
  });
});

describe("createProjectCard", () => {
  it("should create a card for an open organization project", () => {
    const data: GitHubProject = {
      number: 5,
      title: "Test Project",
      shortDescription: "A test project",
      closed: false,
      public: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-06-01T00:00:00Z",
      url: "https://github.com/orgs/testorg/projects/5",
    };

    createProjectCard(data, "testorg", true);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("Test Project");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith("A test project");
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(GITHUB_LOGO);
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should create a card for a closed user project", () => {
    const data: GitHubProject = {
      number: 3,
      title: "Personal Project",
      shortDescription: "My personal project",
      closed: true,
      public: false,
      createdAt: "2023-02-01T00:00:00Z",
      updatedAt: "2023-07-01T00:00:00Z",
      url: "https://github.com/users/testuser/projects/3",
    };

    createProjectCard(data, "testuser", false);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("Personal Project");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "My personal project",
    );
    expect(mockCardHeader.setImageUrl).toHaveBeenCalledWith(GITHUB_LOGO);
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });

  it("should create a card for a project with no description", () => {
    const data: GitHubProject = {
      number: 1,
      title: "Untitled Project",
      closed: false,
      public: true,
      createdAt: "2023-03-01T00:00:00Z",
      updatedAt: "2023-08-01T00:00:00Z",
      url: "https://github.com/orgs/myorg/projects/1",
    };

    createProjectCard(data, "myorg", true);

    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("Untitled Project");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith("GitHub Project");
    expect(mockCardBuilder.build).toHaveBeenCalled();
  });
});

describe("createSettingsSidebar", () => {
  const mockAction = {
    setFunctionName: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).CardService.newAction = jest.fn(() => mockAction);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).CardService.OpenAs = { OVERLAY: "OVERLAY" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).CardService.OnClose = { RELOAD: "RELOAD" };
  });

  it("should create a sidebar for a logged in user", () => {
    const user: GitHubUser = {
      login: "octocat",
      name: "The Octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/123",
      html_url: "https://github.com/octocat",
    };

    const authUrl = "https://github.com/login/oauth/authorize";

    createSettingsSidebar(user, authUrl);

    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("GitHub Smart Chips");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith("Settings");
    expect(mockKeyValue.setTopLabel).toHaveBeenCalledWith("Logged in as");
    expect(mockKeyValue.setContent).toHaveBeenCalledWith("@octocat");
    expect(mockKeyValue.setTopLabel).toHaveBeenCalledWith("Name");
    expect(mockKeyValue.setContent).toHaveBeenCalledWith("The Octocat");
    expect(mockTextButton.setText).toHaveBeenCalledWith("Logout");
    expect(mockAction.setFunctionName).toHaveBeenCalledWith("handleLogout");
  });

  it("should create a sidebar for a logged in user without name", () => {
    const user: GitHubUser = {
      login: "octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/123",
      html_url: "https://github.com/octocat",
    };

    const authUrl = "https://github.com/login/oauth/authorize";

    createSettingsSidebar(user, authUrl);

    expect(mockKeyValue.setTopLabel).toHaveBeenCalledWith("Logged in as");
    expect(mockKeyValue.setContent).toHaveBeenCalledWith("@octocat");
    expect(mockTextButton.setText).toHaveBeenCalledWith("Logout");
  });

  it("should create a sidebar for a logged out user", () => {
    const authUrl = "https://github.com/login/oauth/authorize";

    createSettingsSidebar(null, authUrl);

    expect(mockCardHeader.setTitle).toHaveBeenCalledWith("GitHub Smart Chips");
    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith("Settings");
    expect(mockTextParagraph.setText).toHaveBeenCalledWith(
      "You are not currently logged in. To access private repositories, please authorize this add-on.",
    );
    expect(mockTextButton.setText).toHaveBeenCalledWith(
      "Authorize GitHub Access",
    );
    expect(mockOpenLink.setUrl).toHaveBeenCalledWith(authUrl);
  });
});
