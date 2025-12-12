# GitHub Smart Chips

[![tests](https://github.com/ianlewis/github-smart-chips/actions/workflows/pull_request.tests.yml/badge.svg)](https://github.com/ianlewis/github-smart-chips/actions/workflows/pull_request.tests.yml)
[![Codecov](https://codecov.io/gh/ianlewis/github-smart-chips/graph/badge.svg?token=5F4B33RNHD)](https://codecov.io/gh/ianlewis/github-smart-chips)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/ianlewis/github-smart-chips/badge)](https://securityscorecards.dev/viewer/?uri=github.com%2Fianlewis%2Fgithub-smart-chips)

A Google Docs add-on that provides smart chips with preview links for GitHub
issues and pull requests. This add-on displays GitHub issue and PR information
directly in Google Docs with rich preview cards.

## Features

- **Smart Chips for GitHub Links**: Automatically recognizes GitHub issue and PR
  URLs
- **Rich Previews**: Displays repository owner, name, issue/PR number, title,
  and status
- **GitHub Logo**: Shows the GitHub Octocat logo for easy recognition
- **OAuth Authentication**: Supports private repositories via GitHub OAuth
- **TypeScript**: Built with TypeScript for type safety and better developer
  experience

## Architecture

The add-on is implemented in TypeScript and compiled to JavaScript for Google
Apps Script. It uses:

- **Google Apps Script**: Runtime environment
- **OAuth2 Library**: For GitHub authentication
- **GitHub REST API**: To fetch issue and PR data
- **Link Preview Triggers**: To detect and handle GitHub URLs

## Development

### Prerequisites

- Node.js (see `.node-version`)
- Python (see `.python-version`)
- Make

### Setup

```bash
# Install dependencies
npm install

# Build the project
make build

# Run tests
make unit-test

# Run linters
make lint

# Format code
make format
```

### Project Structure

```text
src/
├── addon.ts      - Main add-on logic and link preview handler
├── github.ts     - GitHub URL parsing and API calls
├── oauth.ts      - OAuth2 authentication with GitHub
├── types.ts      - TypeScript type definitions
├── ui.ts         - UI components (cards and smart chips)
└── index.ts      - Entry point
```

## Self-Hosting

See [SELF-HOSTING.md](SELF-HOSTING.md) for detailed instructions on deploying
and configuring your own instance of the add-on.

## Usage

1. Install the add-on in Google Docs
2. Authorize the add-on to access GitHub
3. Paste a GitHub issue or PR URL in your document
4. The smart chip will display with repository and issue/PR information

## Supported URL Patterns

- `https://github.com/{owner}/{repo}/issues/{number}`
- `https://github.com/{owner}/{repo}/pull/{number}`

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for
details.
