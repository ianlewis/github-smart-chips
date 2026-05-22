# Changelog

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

<!-- New/Unreleased changes go here. -->

## [1.0.0] - `2026-05-22`

- Initial release
- Supported features:
    - **Smart Chips for GitHub Links**: Automatically recognizes GitHub issue
      and PR URLs.
    - **Rich Previews**: Displays repository owner, name, issue/PR number,
      title, and status.
    - **OAuth Authentication**: Supports private repositories via GitHub OAuth.
    - **Cross-Platform**: Works in Google Docs™, Sheets™, and Slides™︎.
    - **Multiple URL Patterns**: Supports various GitHub URLs:
        - User: `https://github.com/{user/org}`
        - Repository: `https://github.com/{owner}/{repo}`
        - Issue: `https://github.com/{owner}/{repo}/issues/{number}`
        - Pull Request: `https://github.com/{owner}/{repo}/pull/{number}`
        - Organization Project: `https://github.com/orgs/{org}/projects/{number}`
        - User Project: `https://github.com/users/{user}/projects/{number}`

[1.0.0]: https://github.com/ianlewis/repo-template/releases/tag/v1.0.0
