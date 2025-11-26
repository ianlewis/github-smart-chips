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

import { describe, it, expect } from "@jest/globals";
import { parseGitHubURL } from "./github.js";
import { GitHubResourceType } from "./types.js";

describe("parseGitHubURL", () => {
  it("should parse GitHub issue URLs", () => {
    const url = "https://github.com/owner/repo/issues/123";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(123);
    expect(result?.type).toBe(GitHubResourceType.Issue);
  });

  it("should parse GitHub PR URLs", () => {
    const url = "https://github.com/owner/repo/pull/456";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(456);
    expect(result?.type).toBe(GitHubResourceType.PullRequest);
  });

  it("should return null for non-GitHub URLs", () => {
    const url = "https://example.com/some/path";
    const result = parseGitHubURL(url);

    expect(result).toBeNull();
  });

  it("should return null for invalid GitHub URLs", () => {
    const url = "https://github.com/owner/repo";
    const result = parseGitHubURL(url);

    expect(result).toBeNull();
  });

  it("should handle URLs with additional path segments", () => {
    const url = "https://github.com/owner/repo/issues/123#issuecomment-456";
    const result = parseGitHubURL(url);

    expect(result).not.toBeNull();
    expect(result?.owner).toBe("owner");
    expect(result?.repo).toBe("repo");
    expect(result?.number).toBe(123);
    expect(result?.type).toBe(GitHubResourceType.Issue);
  });
});
