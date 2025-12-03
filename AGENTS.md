# AGENTS.md

This file provides guidance to AI Coding Agents (e.g. Claude) when working with
code in this repository.

## Project Overview

This is a Google Docs add-on called "GitHub Smart Chips" that provides smart
chips with preview links for GitHub issues and pull requests. The add-on is
built-in TypeScript and compiled to JavaScript for Google Apps Script.

## Development Commands

### Building and Testing

- `make build` - Compile TypeScript to JavaScript
- `make pack` - Create distribution bundle using Rollup.js.
- `make test` - Run all tests and linting
- `make unit-test` - Run Jest unit tests with coverage
- `npm test` - Alternative to run Jest tests

### Code Quality

- `make lint` - Run all linters (`eslint`, `markdownlint`, `textlint`, etc.)
- `make format` - Format all code files
- `make format-check` - Check if formatting is needed

### Deployment

- `make deploy` - Deploy to Google Apps Script (requires clasp configuration)

## Architecture

### Core Components

- `src/index.ts` - Entry point exporting public functions for Apps Script
- `src/addon.ts` - Main add-on logic and link preview handler (`onLinkPreview`)
- `src/github.ts` - GitHub URL parsing and API interaction
- `src/oauth.ts` - OAuth2 authentication with GitHub
- `src/ui.ts` - UI components (cards and smart chips)
- `src/types.ts` - TypeScript type definitions

### Build Process

1. TypeScript compilation to `lib/` directory
2. Rollup.js bundling to `dist/index.js` as CommonJS
3. Copies `appsscript.json` and `.clasp.json` to dist for deployment

### Testing

- Jest configuration with TypeScript support
- Coverage reporting enabled
- Test files use `*.test.ts` pattern
- Uses `ts-jest` preset with ESM support

## Key Technologies

- **Google Apps Script** - Runtime environment
- **OAuth2** - GitHub authentication
- **GitHub REST API** - Fetches issue/PR data
- **TypeScript** - Primary language
- **Rollup.js** - Module bundling
- **Jest** - Unit testing

## Supported GitHub URLs

- `https://github.com/{owner}/{repo}/issues/{number}`
- `https://github.com/{owner}/{repo}/pull/{number}`

## Development Notes

- Uses Make-based build system with comprehensive linting
- Extensive formatting and quality checks (`eslint`, `prettier`, `markdownlint`,
  etc.)
- License headers are automatically maintained
- Uses aqua for tool management
- All commits should follow the Conventional Commits specification following the
  `@commitlint/config-conventional` `commitlint` preset. This includes the
  following types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `style`, and `test`.
