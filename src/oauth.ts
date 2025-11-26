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

/**
 * Get OAuth2 service for GitHub
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGitHubService(): any {
  const scriptProps = PropertiesService.getScriptProperties();
  const clientId = scriptProps.getProperty("GITHUB_CLIENT_ID");
  const clientSecret = scriptProps.getProperty("GITHUB_CLIENT_SECRET");

  // OAuth2 is a library that will be available at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OAuth2Lib = (globalThis as any).OAuth2;

  return OAuth2Lib.createService("github")
    .setAuthorizationBaseUrl("https://github.com/login/oauth/authorize")
    .setTokenUrl("https://github.com/login/oauth/access_token")
    .setClientId(clientId || "")
    .setClientSecret(clientSecret || "")
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope("public_repo");
}

/**
 * OAuth callback handler
 */
export function authCallback(request: {
  parameter: Record<string, string>;
}): GoogleAppsScript.HTML.HtmlOutput {
  const service = getGitHubService();
  const authorized = service.handleCallback(request);

  if (authorized) {
    return HtmlService.createHtmlOutput("Success! You can close this tab.");
  } else {
    return HtmlService.createHtmlOutput(
      "Denied. You can close this tab and try again.",
    );
  }
}

/**
 * Get GitHub access token
 */
export function getAccessToken(): string | null {
  const service = getGitHubService();

  if (service.hasAccess()) {
    return service.getAccessToken();
  }

  return null;
}

/**
 * Get authorization URL
 */
export function getAuthorizationUrl(): string {
  const service = getGitHubService();
  return service.getAuthorizationUrl();
}

/**
 * Reset authorization
 */
export function resetAuth(): void {
  const service = getGitHubService();
  service.reset();
}
