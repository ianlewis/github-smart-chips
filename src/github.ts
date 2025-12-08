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
  type GitHubRepository,
  type GitHubIssue,
  type GitHubPullRequest,
  type GitHubURLInfo,
} from "./types.js";

/**
 * Parse a GitHub URL to extract owner, repo, and issue/PR number
 */
export function parseGitHubURL(url: string): GitHubURLInfo | null {
  const issuePattern = /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
  const pullPattern = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
  const repoPattern =
    /github\.com\/([^/]+)\/([^/]+)(\/(tree|blob)\/([^/]+)\/?|\/?$)/;

  let match = url.match(pullPattern);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3], 10),
      type: "pull_request",
    };
  }

  match = url.match(issuePattern);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3], 10),
      type: "issue",
    };
  }

  match = url.match(repoPattern);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      type: "repository",
    };
  }

  return null;
}

/**
 * GitHub API Client class for fetching GitHub data
 */
export class GitHubAPIClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Fetch repository details
   */
  fetchRepository(owner: string, repo: string): GitHubRepository | null {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = UrlFetchApp.fetch(apiUrl, {
        headers,
        muteHttpExceptions: true,
      });

      if (response.getResponseCode() !== 200) {
        // eslint-disable-next-line no-console
        console.error(
          `GitHub API error: ${response.getResponseCode()} - ${response.getContentText()}`,
        );
        return null;
      }

      const data = JSON.parse(response.getContentText());
      return {
        owner,
        repo,
        description: data.description || "",
        private: data.private || false,
        language: data.language || null,
        stargazers_count: data.stargazers_count || 0,
        forks_count: data.forks_count || 0,
        updated_at: data.updated_at || "",
        html_url: data.html_url || "",
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching GitHub repository data: ${error}`);
      return null;
    }
  }

  /**
   * Fetch issue details
   */
  fetchIssue(owner: string, repo: string, number: number): GitHubIssue | null {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = UrlFetchApp.fetch(apiUrl, {
        headers,
        muteHttpExceptions: true,
      });

      if (response.getResponseCode() !== 200) {
        // eslint-disable-next-line no-console
        console.error(
          `GitHub API error: ${response.getResponseCode()} - ${response.getContentText()}`,
        );
        return null;
      }

      const data = JSON.parse(response.getContentText());
      return {
        owner,
        repo,
        number,
        title: data.title || "",
        state: data.state || "unknown",
        body: data.body || "",
        created_at: data.created_at || "",
        user: {
          login: data.user?.login || "",
          avatar_url: data.user?.avatar_url || "",
          html_url: data.user?.html_url || "",
        },
        labels: data.labels || [],
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching GitHub issue data: ${error}`);
      return null;
    }
  }

  /**
   * Fetch pull request details
   */
  fetchPullRequest(
    owner: string,
    repo: string,
    number: number,
  ): GitHubPullRequest | null {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = UrlFetchApp.fetch(apiUrl, {
        headers,
        muteHttpExceptions: true,
      });

      if (response.getResponseCode() !== 200) {
        // eslint-disable-next-line no-console
        console.error(
          `GitHub API error: ${response.getResponseCode()} - ${response.getContentText()}`,
        );
        return null;
      }

      const data = JSON.parse(response.getContentText());
      return {
        owner,
        repo,
        number,
        title: data.title || "",
        state: data.state || "unknown",
        body: data.body || "",
        created_at: data.created_at || "",
        user: {
          login: data.user?.login || "",
          avatar_url: data.user?.avatar_url || "",
          html_url: data.user?.html_url || "",
        },
        labels: data.labels || [],
        merged: data.merged || false,
        base: { ref: data.base?.ref || "" },
        head: { ref: data.head?.ref || "" },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching GitHub pull request data: ${error}`);
      return null;
    }
  }
}
