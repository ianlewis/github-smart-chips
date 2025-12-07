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

import { parseGitHubURL, GitHubAPIClient } from "./github.js";
import { getAccessToken, getAuthorizationUrl } from "./oauth.js";
import {
  createRepositoryCard,
  createIssueCard,
  createPullRequestCard,
  GITHUB_LOGO,
} from "./ui.js";
import {
  type GitHubRepository,
  type GitHubIssue,
  type GitHubPullRequest,
} from "./types.js";

/**
 * Handle link preview requests for GitHub URLs
 */
export function onLinkPreview(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
):
  | GoogleAppsScript.Card_Service.Card[]
  | GoogleAppsScript.Card_Service.UniversalActionResponse {
  let url = event?.docs?.matchedUrl?.url;
  if (!url) {
    url = event?.sheets?.matchedUrl?.url;
  }
  if (!url) {
    url = event?.slides?.matchedUrl?.url;
  }

  if (!url) {
    return [];
  }

  const urlInfo = parseGitHubURL(url);
  if (!urlInfo) {
    return [];
  }

  const accessToken = getAccessToken();
  const client = new GitHubAPIClient(accessToken || "");

  // First try to fetch data (works for public repos even without token)
  let data = null;
  switch (urlInfo.type) {
    case "repository":
      data = client.fetchRepository(urlInfo.owner, urlInfo.repo);
      break;
    case "issue":
      if (urlInfo.number) {
        data = client.fetchIssue(urlInfo.owner, urlInfo.repo, urlInfo.number);
      }
      break;
    case "pull_request":
      if (urlInfo.number) {
        data = client.fetchPullRequest(
          urlInfo.owner,
          urlInfo.repo,
          urlInfo.number,
        );
      }
      break;
  }

  // If we got no data and no token, try to get auth
  if (!data && !accessToken) {
    return [createAuthorizationCard()];
  }

  // If we still have no data but have a token, there might be another issue
  if (!data) {
    return [
      createErrorCard(
        "Unable to fetch repository data. The repository may not exist or you may not have access to it.",
      ),
    ];
  }

  // Create the appropriate card based on the URL type and data
  let card: GoogleAppsScript.Card_Service.Card;
  switch (urlInfo.type) {
    case "repository":
      card = createRepositoryCard(data as GitHubRepository);
      break;
    case "issue":
      card = createIssueCard(data as GitHubIssue);
      break;
    case "pull_request":
      card = createPullRequestCard(data as GitHubPullRequest);
      break;
    default:
      return [];
  }

  return [card];
}

/**
 * Create a card prompting user to authorize
 */
function createAuthorizationCard(): GoogleAppsScript.Card_Service.Card {
  return CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle("GitHub Smart Chips")
        .setSubtitle("Authorization Required")
        .setImageUrl(GITHUB_LOGO),
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextParagraph().setText(
            "To view private GitHub repositories and get detailed information, please authorize this add-on to access your GitHub account.",
          ),
        )
        .addWidget(
          CardService.newTextButton()
            .setText("Authorize GitHub Access")
            .setOpenLink(
              CardService.newOpenLink()
                .setUrl(getAuthorizationUrl())
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.RELOAD),
            ),
        ),
    )
    .addSection(
      CardService.newCardSection().addWidget(
        CardService.newTextParagraph().setText(
          "Note: Public repositories may still be accessible without authorization.",
        ),
      ),
    )
    .build();
}

/**
 * Create an error card to display when something goes wrong
 */
function createErrorCard(message: string): GoogleAppsScript.Card_Service.Card {
  return CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle("GitHub Smart Chips")
        .setSubtitle("Error")
        .setImageUrl(GITHUB_LOGO),
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(message))
        .addWidget(
          CardService.newTextButton()
            .setText("Try Again")
            .setOpenLink(
              CardService.newOpenLink()
                .setUrl(
                  `https://script.google.com/macros/d/${ScriptApp.getScriptId()}/usercallback?function=resetAuth`,
                )
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.RELOAD),
            ),
        ),
    )
    .build();
}
