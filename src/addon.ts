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

import { parseGitHubURL, fetchGitHubData } from "./github.js";
import { getAccessToken } from "./oauth.js";
import { createPreviewCard } from "./ui.js";

/**
 * Handle link preview requests for GitHub URLs
 */
export function onLinkPreview(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
):
  | GoogleAppsScript.Card_Service.Card[]
  | GoogleAppsScript.Card_Service.UniversalActionResponse {
  const url = event?.docs?.matchedUrl?.url;

  if (!url) {
    return [];
  }

  const urlInfo = parseGitHubURL(url);
  if (!urlInfo) {
    return [];
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    // Return authorization card if not authenticated
    return [createAuthorizationCard()];
  }

  const data = fetchGitHubData(urlInfo, accessToken);
  if (!data) {
    return [];
  }

  return [createPreviewCard(data)];
}

/**
 * Create a card prompting user to authorize
 */
function createAuthorizationCard(): GoogleAppsScript.Card_Service.Card {
  return CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader().setTitle(
        "GitHub Smart Chips - Authorization Required",
      ),
    )
    .addSection(
      CardService.newCardSection().addWidget(
        CardService.newTextParagraph().setText(
          "Please authorize this add-on to access GitHub.",
        ),
      ),
    )
    .build();
}
