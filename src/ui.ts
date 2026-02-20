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
  type GitHubUser,
} from "./types.js";

import { relativeTime, trimString } from "./utils.js";

import { GITHUB_LOGO } from "./logos.js";

/**
 * Create a preview card for a GitHub issue
 */
export function createIssueCard(
  data: GitHubIssue,
): GoogleAppsScript.Card_Service.Card {
  const cardTitle = `${data.repo.full_name}#${data.number}: ${data.title}`;
  const repoUrl = `https://github.com/${data.repo.full_name}`;
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
            .setContent(data.repo.full_name)
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
  const cardTitle = `${data.base.repo.full_name}#${data.number}: ${data.title}`;
  const repoUrl = `https://github.com/${data.base.repo.full_name}`;
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
            .setContent(data.base.repo.full_name)
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
  const subtitle = data.description || "GitHub Repository";

  // Format the updated date
  const updatedDate = new Date(data.updated_at);
  const now = new Date();

  const updatedText = `updated ${relativeTime(now, updatedDate)}`;

  const cardBuilder = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(data.full_name)
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

/**
 * Create a preview card for a GitHub user profile
 */
export function createUserCard(
  data: GitHubUser,
): GoogleAppsScript.Card_Service.Card {
  const subtitle = data.bio || "GitHub User";
  const title = data.name ? `${data.login} (${data.name})` : data.login;

  const cardBuilder = CardService.newCardBuilder().setHeader(
    CardService.newCardHeader()
      .setTitle(title)
      .setSubtitle(subtitle)
      .setImageUrl(data.avatar_url || GITHUB_LOGO),
  );

  // Add username and location
  const infoSection = CardService.newCardSection();

  infoSection.addWidget(
    CardService.newKeyValue()
      .setTopLabel("Username")
      .setContent(`@${data.login}`),
  );

  if (data.location) {
    infoSection.addWidget(
      CardService.newKeyValue()
        .setTopLabel("Location")
        .setContent(data.location),
    );
  }

  if (data.company) {
    infoSection.addWidget(
      CardService.newKeyValue().setTopLabel("Company").setContent(data.company),
    );
  }

  cardBuilder.addSection(infoSection);

  // Add stats section
  if (
    data.public_repos !== undefined ||
    data.followers !== undefined ||
    data.following !== undefined
  ) {
    const statsSection = CardService.newCardSection();

    if (data.public_repos !== undefined) {
      statsSection.addWidget(
        CardService.newKeyValue()
          .setTopLabel("Public Repositories")
          .setContent(data.public_repos.toString()),
      );
    }

    if (data.followers !== undefined && data.following !== undefined) {
      statsSection.addWidget(
        CardService.newKeyValue()
          .setTopLabel("Followers / Following")
          .setContent(`${data.followers} / ${data.following}`),
      );
    }

    cardBuilder.addSection(statsSection);
  }

  // Add blog link if available
  if (data.blog) {
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue().setTopLabel("Website").setContent(data.blog),
      ),
    );
  }

  // Add account creation date if available
  if (data.created_at) {
    const createdDate = new Date(data.created_at);
    const now = new Date();
    const joinedText = `Joined ${relativeTime(now, createdDate)}`;

    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newKeyValue()
          .setTopLabel("Member Since")
          .setContent(joinedText),
      ),
    );
  }

  // Add action button to view on GitHub
  cardBuilder.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextButton()
        .setText("View Profile on GitHub")
        .setOpenLink(CardService.newOpenLink().setUrl(data.html_url)),
    ),
  );

  return cardBuilder.build();
}

/**
 * Create an error card to display when something goes wrong
 */
export function createErrorCard(
  url: string,
  message: string,
): GoogleAppsScript.Card_Service.Card {
  return CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(url)
        .setSubtitle("Error")
        .setImageUrl(GITHUB_LOGO),
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(message))
        .addWidget(
          CardService.newTextButton()
            .setText("Try Again")
            .setOnClickAction(
              CardService.newAction().setFunctionName("resetAuth"),
            ),
        ),
    )
    .build();
}

/**
 * Create a sidebar card for user settings and logout
 */
export function createSettingsSidebar(
  user: GitHubUser | null,
  authorizationUrl: string,
): GoogleAppsScript.Card_Service.Card {
  const cardBuilder = CardService.newCardBuilder().setHeader(
    CardService.newCardHeader()
      .setTitle("GitHub Smart Chips")
      .setSubtitle("Settings")
      .setImageUrl(GITHUB_LOGO),
  );

  if (user) {
    // User is logged in
    const userSection = CardService.newCardSection();

    userSection.addWidget(
      CardService.newKeyValue()
        .setTopLabel("Logged in as")
        .setContent(`@${user.login}`),
    );

    if (user.name) {
      userSection.addWidget(
        CardService.newKeyValue().setTopLabel("Name").setContent(user.name),
      );
    }

    cardBuilder.addSection(userSection);

    // Add logout button
    cardBuilder.addSection(
      CardService.newCardSection().addWidget(
        CardService.newTextButton()
          .setText("Logout")
          .setOnClickAction(
            CardService.newAction().setFunctionName("handleLogout"),
          ),
      ),
    );
  } else {
    // User is not logged in
    cardBuilder.addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextParagraph().setText(
            "You are not currently logged in. To access private repositories, please authorize this add-on.",
          ),
        )
        .addWidget(
          CardService.newTextButton()
            .setText("Authorize GitHub Access")
            .setOpenLink(
              CardService.newOpenLink()
                .setUrl(authorizationUrl)
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.RELOAD),
            ),
        ),
    );
  }

  return cardBuilder.build();
}
