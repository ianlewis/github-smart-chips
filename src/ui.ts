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
} from "./types.js";

import { relativeTime, trimString } from "./utils.js";

import { GITHUB_LOGO } from "./logos.js";

/**
 * Create a preview card for a GitHub issue
 */
export function createIssueCard(
  data: GitHubIssue,
): GoogleAppsScript.Card_Service.Card {
  const cardTitle = `${data.owner}/${data.repo}#${data.number}: ${data.title}`;
  const repoUrl = `https://github.com/${data.owner}/${data.repo}`;
  const itemUrl = `${repoUrl}/issues/${data.number}`;

  // Format the created date
  const createdDate = new Date(data.created_at).toLocaleDateString();

  // Truncate body to first 50 characters
  const bodySnippet = trimString(data.body || "", 50);

  // Create state indicator with appropriate icon
  const stateIcon = data.state === "closed" ? "🔴" : "🟢";

  const cardBuilder = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(cardTitle)
        .setSubtitle(`${stateIcon} Issue #${data.number} • ${data.state}`)
        .setImageUrl(GITHUB_LOGO),
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newKeyValue()
            .setTopLabel("Repository")
            .setContent(`${data.owner}/${data.repo}`)
            .setOpenLink(CardService.newOpenLink().setUrl(repoUrl)),
        )
        .addWidget(
          CardService.newKeyValue()
            .setTopLabel("Created")
            .setContent(`${createdDate} by ${data.user.login}`),
        ),
    );

  // Add body snippet if available
  if (bodySnippet) {
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newTextParagraph().setText(bodySnippet),
      ),
    );
  }

  // Add labels section if any labels exist
  if (data.labels && data.labels.length > 0) {
    const labelsText = data.labels.map((label) => label.name).join(", ");
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue().setTopLabel("Labels").setContent(labelsText),
      ),
    );
  }

  // Add action button to view on GitHub
  cardBuilder.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextButton()
        .setText("View Issue on GitHub")
        .setOpenLink(CardService.newOpenLink().setUrl(itemUrl)),
    ),
  );

  return cardBuilder.build();
}

/**
 * Create a preview card for a GitHub pull request
 */
export function createPullRequestCard(
  data: GitHubPullRequest,
): GoogleAppsScript.Card_Service.Card {
  const cardTitle = `${data.owner}/${data.repo}#${data.number}: ${data.title}`;
  const repoUrl = `https://github.com/${data.owner}/${data.repo}`;
  const itemUrl = `${repoUrl}/pull/${data.number}`;

  // Format the created date
  const createdDate = new Date(data.created_at).toLocaleDateString();

  // Truncate body to first 50 characters
  const bodySnippet = trimString(data.body || "", 50);

  // Create state indicator with appropriate icon
  let stateIcon = "🟢"; // open
  if (data.state === "closed") {
    stateIcon = data.merged ? "🟣" : "🔴";
  }

  const cardBuilder = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(cardTitle)
        .setSubtitle(
          `${stateIcon} Pull Request #${data.number} • ${data.state}`,
        )
        .setImageUrl(GITHUB_LOGO),
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newKeyValue()
            .setTopLabel("Repository")
            .setContent(`${data.owner}/${data.repo}`)
            .setOpenLink(CardService.newOpenLink().setUrl(repoUrl)),
        )
        .addWidget(
          CardService.newKeyValue()
            .setTopLabel("Created")
            .setContent(`${createdDate} by ${data.user.login}`),
        ),
    );

  // Add body snippet if available
  if (bodySnippet) {
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newTextParagraph().setText(bodySnippet),
      ),
    );
  }

  // Add labels section if any labels exist
  if (data.labels && data.labels.length > 0) {
    const labelsText = data.labels.map((label) => label.name).join(", ");
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue().setTopLabel("Labels").setContent(labelsText),
      ),
    );
  }

  // Add branch information
  if (data.base && data.head) {
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue()
          .setTopLabel("Branches")
          .setContent(`${data.base.ref} ← ${data.head.ref}`),
      ),
    );
  }

  // Add action button to view on GitHub
  cardBuilder.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextButton()
        .setText("View Pull Request on GitHub")
        .setOpenLink(CardService.newOpenLink().setUrl(itemUrl)),
    ),
  );

  return cardBuilder.build();
}

/**
 * Create a preview card for a GitHub repository
 */
export function createRepositoryCard(
  data: GitHubRepository,
): GoogleAppsScript.Card_Service.Card {
  const repoName = `${data.owner}/${data.repo}`;
  const subtitle = data.description || "GitHub Repository";

  // Format the updated date
  const updatedDate = new Date(data.updated_at);
  const now = new Date();

  const updatedText = `updated ${relativeTime(now, updatedDate)}`;

  const cardBuilder = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(repoName)
        .setSubtitle(subtitle)
        .setImageUrl(GITHUB_LOGO),
    )
    .addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue()
          .setTopLabel("Visibility")
          .setContent(data.private ? "🔒 Private" : "🌐 Public"),
      ),
    );

  // Add language if available
  if (data.language) {
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue()
          .setTopLabel("Language")
          .setContent(data.language),
      ),
    );
  }

  // Add stats section
  cardBuilder.addSection(
    CardService.newCardSection()
      .addWidget(
        CardService.newKeyValue()
          .setTopLabel("Stats")
          .setContent(`⭐ ${data.stargazers_count} • 🍴 ${data.forks_count}`),
      )
      .addWidget(
        CardService.newKeyValue()
          .setTopLabel("Last Updated")
          .setContent(updatedText),
      ),
  );

  // Add action button to view on GitHub
  cardBuilder.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextButton()
        .setText("View Repository on GitHub")
        .setOpenLink(CardService.newOpenLink().setUrl(data.html_url)),
    ),
  );

  return cardBuilder.build();
}
