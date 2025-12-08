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

/**
 * GitHub user data
 */
export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

/**
 * GitHub label data
 */
export interface GitHubLabel {
  name: string;
  color: string;
  description?: string;
}

/**
 * GitHub issue data
 */
export interface GitHubIssue {
  number: number;
  title: string;
  state: string;
  body?: string;
  created_at: string;
  user: GitHubUser;
  repo: GitHubRepository;
  labels: GitHubLabel[];
}

/**
 * GitHub pull request data
 */
export interface GitHubPullRequest {
  number: number;
  title: string;
  state: string;
  body?: string;
  created_at: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  merged?: boolean;
  base: {
    ref: string;
    repo: GitHubRepository;
  };
  head: {
    ref: string;
    repo: GitHubRepository;
  };
}

/**
 * GitHub repository data
 */
export interface GitHubRepository {
  owner: GitHubUser;
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

/**
 * Parsed GitHub URL information
 */
export interface GitHubURLInfo {
  owner: string;
  repo: string;
  number?: number;
  type: "repository" | "issue" | "pull_request";
}
