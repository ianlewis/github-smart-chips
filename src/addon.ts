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
import { getAccessToken, getAuthorizationUrl, resetAuth } from "./oauth.js";
import {
  createRepositoryCard,
  createIssueCard,
  createPullRequestCard,
  createUserCard,
  createErrorCard,
  createSettingsSidebar,
} from "./ui.js";
import { GITHUB_LOGO } from "./logos.js";

/**
 * Handle link preview requests for GitHub URLs
 */
export function onLinkPreview(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
): GoogleAppsScript.Card_Service.Card[] {
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
  let card: GoogleAppsScript.Card_Service.Card | null = null;
  switch (urlInfo.type) {
    case "repository": {
      if (urlInfo.repo) {
        const repo = client.fetchRepository(urlInfo.owner, urlInfo.repo);
        if (!repo) {
          break;
        }
        card = createRepositoryCard(repo);
      }
      break;
    }
    case "issue": {
      if (urlInfo.number && urlInfo.repo) {
        const issue = client.fetchIssue(
          urlInfo.owner,
          urlInfo.repo,
          urlInfo.number,
        );
        if (!issue) {
          break;
        }
        card = createIssueCard(issue);
      }
      break;
    }
    case "pull_request": {
      if (urlInfo.number && urlInfo.repo) {
        const pull = client.fetchPullRequest(
          urlInfo.owner,
          urlInfo.repo,
          urlInfo.number,
        );
        if (!pull) {
          break;
        }
        card = createPullRequestCard(pull);
      }
      break;
    }
    case "user": {
      const user = client.fetchUser(urlInfo.owner);
      if (!user) {
        break;
      }
      card = createUserCard(user);
      break;
    }
  }

  // If we got no data and no token, try to get auth
  if (!card && !accessToken) {
    CardService.newAuthorizationException()
      .setAuthorizationUrl(getAuthorizationUrl())
      .setResourceDisplayName("GitHub Account")
      .setCustomUiCallback("createAuthorizationCard")
      .throwException();
  }

  // If we still have no data but have a token, there might be another issue
  if (!card) {
    return [
      createErrorCard(
        url,
        "Unable to fetch repository data. The repository may not exist or you may not have access to it.",
      ),
    ];
  }

  return [card];
}

/**
 * Create a card prompting user to authorize
 */
export function createAuthorizationCard(): GoogleAppsScript.Card_Service.Card {
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
 * Show sidebar with settings and logout option
 */
export function showSidebar(): GoogleAppsScript.Card_Service.Card[] {
  const accessToken = getAccessToken();
  let user = null;

  if (accessToken) {
    const client = new GitHubAPIClient(accessToken);
    user = client.fetchAuthenticatedUser();
  }

  const authUrl = getAuthorizationUrl();
  return [createSettingsSidebar(user, authUrl)];
}

/**
 * Handle logout action
 */
export function handleLogout(): GoogleAppsScript.Card_Service.ActionResponse {
  resetAuth();

  const authUrl = getAuthorizationUrl();

  // Return an action response that reloads the sidebar
  return CardService.newActionResponseBuilder()
    .setNavigation(
      CardService.newNavigation().updateCard(
        createSettingsSidebar(null, authUrl),
      ),
    )
    .setNotification(
      CardService.newNotification().setText("Successfully logged out"),
    )
    .build();
}
