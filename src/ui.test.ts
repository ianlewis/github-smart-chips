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
import { createSmartChip } from "./ui.js";
import type { GitHubIssueOrPR } from "./types.js";

describe("createSmartChip", () => {
  it("should create a smart chip for an issue", () => {
    const data: GitHubIssueOrPR = {
      owner: "octocat",
      repo: "hello-world",
      number: 123,
      title: "Test Issue",
      state: "open",
      isPullRequest: false,
    };

    const chip = createSmartChip(
      "https://github.com/octocat/hello-world/issues/123",
      data,
    );

    expect(chip.text).toBe("octocat/hello-world Issue #123");
    expect(chip.title).toBe("Test Issue");
    expect(chip.iconUrl).toBeDefined();
  });

  it("should create a smart chip for a PR", () => {
    const data: GitHubIssueOrPR = {
      owner: "octocat",
      repo: "hello-world",
      number: 456,
      title: "Test PR",
      state: "open",
      isPullRequest: true,
    };

    const chip = createSmartChip(
      "https://github.com/octocat/hello-world/pull/456",
      data,
    );

    expect(chip.text).toBe("octocat/hello-world PR #456");
    expect(chip.title).toBe("Test PR");
    expect(chip.iconUrl).toBeDefined();
  });
});
