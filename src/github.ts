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
  GitHubResourceType,
  type GitHubResource,
  type GitHubURLInfo,
} from "./types.js";

/**
 * Parse a GitHub URL to extract owner, repo, and issue/PR number
 */
export function parseGitHubURL(url: string): GitHubURLInfo | null {
  const issuePattern = /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/;
  const pullPattern = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
  const repoPattern = /github\.com\/([^/]+)\/([^/]+?)(?:\/|$|\?|#)/;

  let match = url.match(pullPattern);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3], 10),
      type: GitHubResourceType.PullRequest,
    };
  }

  match = url.match(issuePattern);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3], 10),
      type: GitHubResourceType.Issue,
    };
  }

  match = url.match(repoPattern);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      type: GitHubResourceType.Repository,
    };
  }

  return null;
}

/**
 * Fetch GitHub resource data using the GitHub API
 */
export function fetchGitHubData(
  urlInfo: GitHubURLInfo,
  accessToken: string,
): GitHubResource | null {
  if (urlInfo.type === GitHubResourceType.Repository) {
    return fetchRepositoryData(urlInfo, accessToken);
  } else {
    return fetchIssueOrPRData(urlInfo, accessToken);
  }
}

/**
 * Fetch GitHub issue or PR data using the GitHub API
 */
function fetchIssueOrPRData(
  urlInfo: GitHubURLInfo,
  accessToken: string,
): GitHubResource | null {
  if (!urlInfo.number) {
    return null;
  }

  const endpoint =
    urlInfo.type === GitHubResourceType.PullRequest ? "pulls" : "issues";
  const apiUrl = `https://api.github.com/repos/${urlInfo.owner}/${urlInfo.repo}/${endpoint}/${urlInfo.number}`;

  try {
    const response = UrlFetchApp.fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
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
      owner: urlInfo.owner,
      repo: urlInfo.repo,
      number: urlInfo.number,
      title: data.title || "",
      state: data.state || "unknown",
      type: urlInfo.type as
        | GitHubResourceType.Issue
        | GitHubResourceType.PullRequest,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching GitHub data: ${error}`);
    return null;
  }
}

/**
 * Fetch GitHub repository data using the GitHub API
 */
function fetchRepositoryData(
  urlInfo: GitHubURLInfo,
  accessToken: string,
): GitHubResource | null {
  const apiUrl = `https://api.github.com/repos/${urlInfo.owner}/${urlInfo.repo}`;

  try {
    const response = UrlFetchApp.fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
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
      owner: urlInfo.owner,
      repo: urlInfo.repo,
      description: data.description || "",
      type: GitHubResourceType.Repository,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching GitHub data: ${error}`);
    return null;
  }
}
