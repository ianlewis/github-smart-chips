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

import { relativeTime, trimString } from "./utils.js";

describe("trimString", () => {
  it("should trim a long string", () => {
    const longString = "This is a very long string that should be trimmed.";
    const want = "This is a very long string...";
    const result = trimString(longString, want.length);
    expect(result).toBe(want);
  });

  it("should not trim a short string", () => {
    const shortString = "This is a short string.";
    const result = trimString(shortString, 50);
    expect(result).toBe(shortString);
  });

  it("should not add elipsis if too long", () => {
    const shortString = "short string";
    const suffix = ".............";
    const result = trimString(shortString, 5, suffix);
    expect(result).toBe("short");
  });
});

describe("relativeTime", () => {
  it("should format today", () => {
    const now = new Date(2025, 0, 30, 12, 0, 0);
    const updated = new Date(2025, 0, 30, 11, 0, 0); // 1 hour ago

    const result = relativeTime(now, updated);
    expect(result).toBe("today");
  });

  it("should format yesterday", () => {
    const now = new Date(2025, 0, 30, 12, 0, 0);
    const updated = new Date(2025, 0, 29, 11, 0, 0); // 25 hours ago

    const result = relativeTime(now, updated);
    expect(result).toBe("yesterday");
  });

  it("should format into days", () => {
    const now = new Date(2025, 0, 30, 12, 0, 0);
    const updated = new Date(2025, 0, 27, 11, 0, 0); // 3 days ago

    const result = relativeTime(now, updated);
    expect(result).toBe("3 days ago");
  });

  it("should format into weeks", () => {
    const now = new Date(2025, 0, 30, 12, 0, 0);
    const updated = new Date(2025, 0, 15, 11, 0, 0); // 15 days ago

    const result = relativeTime(now, updated);
    expect(result).toBe("2 weeks ago");
  });

  it("should format into days", () => {
    const now = new Date(2025, 3, 30, 12, 0, 0);
    const updated = new Date(2025, 0, 27, 11, 0, 0); // 3 months ago

    const result = relativeTime(now, updated);
    expect(result).toBe("3 months ago");
  });
});
