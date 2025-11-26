# `repo-template-ts`

<!-- TODO: update badge urls -->

[![tests](https://github.com/ianlewis/repo-template-ts/actions/workflows/pull_request.tests.yml/badge.svg)](https://github.com/ianlewis/repo-template-ts/actions/workflows/pull_request.tests.yml)
[![Codecov](https://codecov.io/gh/ianlewis/repo-template-ts/graph/badge.svg?token=STWQS28VUG)](https://codecov.io/gh/ianlewis/repo-template-ts)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/ianlewis/repo-template-ts/badge)](https://securityscorecards.dev/viewer/?uri=github.com%2Fianlewis%2Frepo-template-ts)

<!-- TODO: Update README contents. -->

Repository template for TypeScript repositories under `github.com/ianlewis`.

This repository template is maintained for use in repositories under
`github.com/ianlewis`. However, it can be used as a general purpose TypeScript
repository starter template.

This repository is set up to make use of ESM modules and makes use of
[Jest](https://jestjs.io/) for unit tests.

## Goals

### Repository quality

A set of [formatters and linters](#formatting-and-linting) are maintained to
maintain repository code and configuration quality through pull request status
checks.

### Consistency & Reproducibility

Repositories created by this template should work as consistently as possible by
minimizing issues due to conflicting installed package versions. Running
commands and tools locally should have the same result between different local
development machines and CI. Recommended language runtime versions are set via
their respective ecosystem tooling.

This template strives to minimize outside dependencies on tools and
configuration requiring only a [minimal set](#requirements) of Unix userspace
tools and language runtimes to work. Dependencies are downloaded and stored
locally inside the project directory so they don't conflict with globally
installed package versions.

### Security

In general, dependencies for tools and GitHub Actions are pinned to improve
overall project supply-chain security.

External dependencies on GitHub actions are limited to trusted actions with
good security practices (e.g. official GitHub-owned actions) to minimize
exposure to compromise via external repositories.

Versioning of formatting, linting, and other tool dependencies is done via the
`requirements.txt` and `packages.json` where possible. This is so that the
versions can be maintained and updated via dependency automation tooling. This
repository uses [Mend Renovate](https://www.mend.io/renovate/) because it
allows more flexibility in configuration than Dependabot.

See also [Recommended repository settings](#recommended-repository-settings)
for more recommended security settings.

## Requirements

This repository template is meant to be used on Linux x86-64 (AMD64) systems.
There is partial support for macOS ARM64 but `checkmake` does not provide an
ARM64 release binary so it doesn't work on macOS.

In general, dependencies on outside tools should be minimized in favor of
including them as project-local dependencies.

1. Language runtimes

    The following language runtimes are required. It is recommended to use a tool
    that can manage multiple language runtime versions such as
    [`pyenv`](https://github.com/pyenv/pyenv),
    [`nodenv`](https://github.com/nodenv/nodenv),
    [`nvm`](https://github.com/nvm-sh/nvm), or [`asdf`](https://asdf-vm.com/). This
    repository includes `.node-version` and `.python-version` files to specify the
    language runtime versions to use for maximum compatibility with these tools.
    - [`Node.js`]: Node.js is required to run some linters and formatters.
    - [`Python`]: Python is required to run some linters and formatters.

2. System tools

    The following tools need to be installed:
    - [`git`]: For repository management.
    - `awk`, `basename`, `bash`, `dirname`, `grep`, `head`, `mktemp`, `rm`,
      `sha256sum`, `uname`: Standard Unix tools (GNU version).
    - GNU `make`: For running commands.
    - `curl`, `tar`, `gzip`: For extracting archives.

    On macOS you can install the required packages with Homebrew.

    ```bash
    brew install \
        make \
        grep \
        gawk \
        coreutils \
        libyaml \
        xz
    ```

The following tools are automatically installed locally to the project and
do not need to be pre-installed:

- [`actionlint`]: For linting GitHub Actions workflows (installed by Aqua in
  `.aqua`).
- [`checkmake`]: For linting `Makefile` (installed by Aqua in `.aqua`).
- [`commitlint`]: For checking commit messages (installed by local
- [`eslint`]: For linting JavaScript and TypeScript (installed in local
  `node_modules`).
- [`jq`]: For parsing output of some linters (installed by Aqua in `.aqua`).
- [`markdownlint`]: For linting markdown (installed in local `node_modules`).
- [`mbrukman/autogen`]: For adding license headers (vendored in `third_party`).
- [`prettier`]: For formatting markdown and YAML files (installed in local
  `node_modules`).
- [`shellcheck`]: For linting shell code in GitHub Actions workflows (installed
  by Aqua in `.aqua`).
- [`textlint`]: For spelling checks (installed in local `node_modules`).
- [`todos`]: For checking for outstanding TODOs in code (installed by Aqua in
  `.aqua`).
- [`yamllint`]: For linting YAML files (installed in local Python virtualenv
  `.venv`).
- [`zizmor`]: For linting GitHub Actions workflows (installed in local Python
  virtualenv `.venv`).

## Usage

The repository is organized to be as self-contained as possible. Commands are
implemented in the project [Makefile](#makefile).

### Makefile

The `Makefile` is used for running commands, managing files, and maintaining
code quality. It includes a default `help` target that prints all make targets
and their descriptions grouped by function.

```shell
$ make
repo-template-ts Makefile
Usage: make [COMMAND]

  help                      Print all Makefile targets (this message).
Build
  all                       Build everything.
  build                     Build the project.
  pack                      Create a package tarball.
Testing
  test                      Run all tests.
  unit-test                 Runs all unit tests.
Formatting
  format                    Format all files
  js-format                 Format YAML files.
  json-format               Format JSON files.
  md-format                 Format Markdown files.
  yaml-format               Format YAML files.
  ts-format                 Format YAML files.
Linting
  lint                      Run all linters.
  actionlint                Runs the actionlint linter.
  checkmake                 Runs the checkmake linter.
  commitlint                Run commitlint linter.
  eslint                    Runs eslint.
  fixme                     Check for outstanding FIXMEs.
  format-check              Check that files are properly formatted.
  markdownlint              Runs the markdownlint linter.
  renovate-config-validator Validate Renovate configuration.
  textlint                  Runs the textlint linter.
  yamllint                  Runs the yamllint linter.
  zizmor                    Runs the zizmor linter.
Maintenance
  todos                     Print outstanding TODOs.
  clean                     Delete temporary files.
```

### Formatting and linting

Some `Makefile` targets for basic formatters and linters are included along
with GitHub Actions pre-submits. Where possible, pre-submits use `Makefile`
targets and those targets execute with the same settings as they do when run
locally. This is to give a consistent experience when attempting to reproduce
pre-submit errors.

Versioning of formatting, linting, and other tools are managed as tool
dependencies so they can be more easily maintained.

`Makefile` targets and linter/formatter configuration are designed to respect
`.gitignore` and not cross `git submodule` boundaries. However, you will need
to add files using `git add` for new files before they are picked up.

`Makefile` targets for linters will also produce human-readable output by
default, but will produce errors as [GitHub Actions workflow
commands](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions)
so they can be easily interpreted when run in Pull-Request [status
checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks).

### License headers

The `license-headers` make target will add license headers to files that are
missing it with the Copyright holder set to the current value of `git config
user.name`.

Files are checked for the existence license headers in status checks.

## Project documentation

This repository template includes stub documentation. Examples of
`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` can be found in the
[`ianlewis/ianlewis`](https://github.com/ianlewis/ianlewis) repository and are
maintained in line with [GitHub recommended community
standards](https://opensource.guide/).

## Repository creation checklist

When creating a new repository from this template, the following checklist
is recommended to ensure the repository is set up correctly.

### Update configuration files

Files that should be updated include a TODO comment to indicate what changes
should made. You can run `make todos` to list all TODOs in the repository.

```shell
$ make todos
.github/workflows/pre-submit.units.yml:113:# TODO: Remove the next line for private repositories with GitHub Advanced Security.
.github/workflows/schedule.scorecard.yml:80:# TODO: Remove the next line for private repositories with GitHub Advanced Security.
CODEOWNERS:1:# TODO: Update CODEOWNERS
CODE_OF_CONDUCT.md:61:<!-- TODO: update Code of Conduct contact email -->
README.md:3:<!-- TODO: update badge urls -->
README.md:7:<!-- TODO: Update README contents. -->
```

### Recommended repository settings

The following repository settings are recommended in conjunction with this
repository template.

#### General / Pull Requests

1. [ ] **Allow merge commits:** Enabling merge commits is recommended
       to preserve the original commit history of a pull request. This makes it
       easier to retain the original commit messages and signatures of
       contributors. Disallowing squash merges and rebase merges is recommended.

#### GitHub Apps

1. [ ] **Enable [DCO](https://github.com/apps/dco):** Enable the DCO GitHub App
       to ensure that all commits are signed off by the author. This is a
       lightweight alternative to a [Contributor License
       Agreement](https://en.wikipedia.org/wiki/Contributor_License_Agreement)
       (CLA) for contributors to certify that they wrote or otherwise have the
       right to submit the code they are contributing to the project. If you
       have a CLA you can omit this step.

#### Rules / Rulesets

A `ruleset` should be created for the default branch with branch protection
rules that follow the [recommendations from OpenSSF
Scorecard](https://github.com/ossf/scorecard/blob/main/docs/checks.md#branch-protection)
to achieve the highest Tier and score as possible.

##### Branch rules

- [ ] **Require a pull request before merging:** This is recommended to ensure
      that all changes to the default branch are reviewed and the code
      passes status checks. This helps maintain code quality and security.

- [ ] **Require status checks to pass:** This is recommended to ensure that all
      pull requests pass the required checks before they can be merged. This
      helps maintain code quality and prevents broken code from being merged
      into the default branch.

    **Status checks that are required:** The following checks should be marked
    as required:
    - [ ] `DCO`
    - [ ] `actionlint / actionlint`
    - [ ] `checkmake / checkmake`
    - [ ] `commitlint / commitlint`
    - [ ] `format-check / format-check`
    - [ ] `eslint / eslint`
    - [ ] `markdownlint / markdownlint`
    - [ ] `renovate-config-validator / renovate-config-validator`
    - [ ] `textlint / textlint`
    - [ ] `fixme / fixme`
    - [ ] `unit-test / unit-test`
    - [ ] `yamllint / yamllint`
    - [ ] `zizmor / zizmor`

##### Block force pushes

- [ ] **Block force pushes:** This is recommended to ensure that all changes to
      the default branch are made via pull requests.

##### Require code scanning results

The following tools should be added to the required code scanning results.

- [ ] `CodeQL`
- [ ] `zizmor`

#### Advanced Security

1. [ ] **Private vulnerability reporting:**
       Enable [private vulnerability reporting] as mentioned in [`SECURITY.md`].
2. [ ] **Dependency Graph:**
       Enable the [dependency graph] and automatic dependency submission.
       Renovate relies on dependency graph for its [vulnerability
       alerts](https://docs.renovatebot.com/configuration-options/#vulnerabilityalerts)
       feature.
3. [ ] **Dependabot Alerts:**
       Enable [Dependabot alerts]. Renovate relies on Dependabot alerts for its
       [vulnerability
       alerts](https://docs.renovatebot.com/configuration-options/#vulnerabilityalerts)
       feature.

##### Code scanning

1. [ ] **CodeQL analysis:**
       Make sure "GitHub Actions (Public Preview)" is enabled in languages.
2. [ ] **Protection rules:**
    - [ ] **Security alert severity level:** Errors and warnings
    - [ ] **Standard alert severity level:** Errors and warnings
3. [ ] **Secret protection:**
       Get alerts when secrets are detected in the repository.
4. [ ] **Push protection:**
       Block pushing commits with secrets in them.

#### Secrets and variables / Actions

Add the repository to [Codecov](https://codecov.io/) for code coverage. View the Codecov
[Quick Start Guide](https://docs.codecov.com/docs/quick-start) for more information.

- [ ] **`CODECOV_TOKEN`:** add the repository upload token as a repository secret.

## Conventional commits

This repository template uses [Conventional
Commits](https://www.conventionalcommits.org/en/v1.0.0/) to standardize commit
message formatting. Conventional commits can help to communicate the nature of
changes at a glance, and give hints on backwards compatibility.

While you _may_ use conventional commits to automatically determine the next
release version, it is **not** recommended to use conventional commits to auto
generate user-facing documentation such as the `CHANGELOG.md` or release notes.
These should be written for an end-user audience, be human readable, and include
additional relevant information and context.

## Keeping repositories in sync

You can optionally keep repositories created with the template in sync with
changes to the template. Because repositories created from GitHub templates are
not forks, it is recommended to perform a squash merge to squash the merge as a
commit on your commit history.

```shell
# One time step: Add the repository template as a remote.
git remote add repo-template-ts git@github.com:ianlewis/repo-template-ts.git

# Fetch the latest version of the repo-template-ts.
git fetch repo-template-ts main

# Create a new squash merge commit.
git merge --no-edit --signoff --squash --allow-unrelated-histories --log repo-template-ts/main
```

## Contributing

PRs may be accepted to this template. See [`CONTRIBUTING.md`] for contributor
documentation.

[Dependabot alerts]: https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts
[dependency graph]: https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph
[private vulnerability reporting]: https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository
[`CONTRIBUTING.md`]: ./CONTRIBUTING.md
[`SECURITY.md`]: ./SECURITY.md
[`Node.js`]: https://nodejs.org/
[`Python`]: https://www.python.org/
[`actionlint`]: https://github.com/rhysd/actionlint
[`checkmake`]: https://github.com/checkmake/checkmake
[`commitlint`]: https://commitlint.js.org/
[`eslint`]: https://eslint.org/
[`mbrukman/autogen`]: https://github.com/mbrukman/autogen
[`git`]: https://git-scm.com/
[`jq`]: https://jqlang.org/
[`markdownlint`]: https://github.com/DavidAnson/markdownlint
[`prettier`]: https://prettier.io/
[`shellcheck`]: https://www.shellcheck.net/
[`textlint`]: https://textlint.github.io/
[`todos`]: https://github.com/ianlewis/todos
[`yamllint`]: https://www.yamllint.com/
[`zizmor`]: https://woodruffw.github.io/zizmor/
