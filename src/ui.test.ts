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
} from "./ui.js";
import {
  type GitHubRepository,
  type GitHubIssue,
  type GitHubPullRequest,
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
};

const mockOpenLink = {
  setUrl: jest.fn().mockReturnThis(),
};

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).CardService = {
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
      owner: "octocat",
      repo: "hello-world",
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
      owner: "octocat",
      repo: "hello-world",
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
      owner: "octocat",
      repo: "hello-world",
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
      owner: "octocat",
      repo: "hello-world",
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
      base: { ref: "main" },
      head: { ref: "feature-branch" },
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
      owner: "octocat",
      repo: "hello-world",
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
      base: { ref: "main" },
      head: { ref: "feature-branch" },
    };

    createPullRequestCard(data);

    expect(mockCardHeader.setSubtitle).toHaveBeenCalledWith(
      "🟣 Pull Request #456 • closed",
    );
  });

  it("should create a card for a closed but not merged pull request", () => {
    const data: GitHubPullRequest = {
      owner: "octocat",
      repo: "hello-world",
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
      base: { ref: "main" },
      head: { ref: "feature-branch" },
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
      owner: "octocat",
      repo: "hello-world",
      description: "A test repository",
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
      owner: "octocat",
      repo: "private-repo",
      description: "A private repository",
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
      owner: "octocat",
      repo: "no-desc-repo",
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
      owner: "octocat",
      repo: "no-lang-repo",
      description: "Repository without main language",
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
