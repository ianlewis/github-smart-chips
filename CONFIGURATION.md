# Configuration Guide

This guide explains how to configure the GitHub Smart Chips add-on for your
Google Apps Script project.

## Required Script Properties

The add-on requires two script properties to authenticate with GitHub. These
must be set in your Google Apps Script project settings.

### `GITHUB_CLIENT_ID`

Your GitHub OAuth App Client ID.

**Format**: Starts with `Iv1.` followed by alphanumeric characters

**Example**: `Iv1.abc123def456`

### `GITHUB_CLIENT_SECRET`

Your GitHub OAuth App Client Secret.

**Format**: A 40-character hexadecimal string

**Example**: `abc123def456ghi789jkl012mno345pqr678stu901`

## How to Set Script Properties

1. Open your Apps Script project at <https://script.google.com>
2. Click the **gear icon** (Project Settings)
3. Scroll down to the **"Script Properties"** section
4. Click **"Add script property"**
5. Add each property:
    - **Property name**: `GITHUB_CLIENT_ID`
    - **Value**: Your GitHub OAuth App Client ID (paste the value)
6. Click **"Add script property"** again for the second property:
    - **Property name**: `GITHUB_CLIENT_SECRET`
    - **Value**: Your GitHub OAuth App Client Secret (paste the value)
7. Click **"Save script properties"**

## Obtaining GitHub OAuth Credentials

If you haven't created a GitHub OAuth App yet, follow these steps:

1. Go to <https://github.com/settings/developers>
2. Click **"New OAuth App"**
3. Fill in the form:
    - **Application name**: Your chosen name (e.g., "GitHub Smart Chips")
    - **Homepage URL**: Your repository or website URL
    - **Authorization callback URL**:
      `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
        - Replace `{SCRIPT_ID}` with your actual Apps Script project Script ID
        - Find your Script ID in Project Settings (gear icon)
4. Click **"Register application"**
5. Copy the **Client ID** immediately
6. Click **"Generate a new client secret"**
7. Copy the **Client Secret** immediately (it won't be displayed again)

## OAuth Scopes

When users authenticate, the add-on requests the `repo` scope from GitHub. This
scope is required to:

- Access public repositories
- Access private repositories (if the user has permission)
- Fetch issue and pull request details

Users will be prompted to authorize this scope when they first use the add-on.

## Verifying Your Configuration

After setting up script properties:

1. Deploy your add-on (see [DEPLOYMENT.md](DEPLOYMENT.md))
2. Open a Google Doc
3. Try pasting a GitHub issue URL (e.g.,
   `https://github.com/octocat/Hello-World/issues/1`)
4. If prompted, authorize the add-on to access GitHub
5. The URL should convert to a smart chip with issue details

## Common Configuration Issues

### Issue: "Invalid client ID or secret"

**Causes**:

- Script properties are not set
- Property names are misspelled (they are case-sensitive)
- Extra spaces or newlines in the values

**Solution**:

1. Verify property names are exactly `GITHUB_CLIENT_ID` and
   `GITHUB_CLIENT_SECRET`
2. Check that values don't have trailing spaces or newlines
3. Try copying and pasting the values again from GitHub

### Issue: "Callback URL mismatch"

**Causes**:

- The callback URL in your GitHub OAuth App doesn't match your Apps Script
  project

**Solution**:

1. Get your Script ID from Apps Script Project Settings
2. Update the callback URL in your GitHub OAuth App to:
   `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
3. Make sure to replace `{SCRIPT_ID}` with your actual Script ID

### Issue: "Access denied to private repositories"

**Causes**:

- The OAuth App hasn't been authorized for the user
- The user doesn't have access to the repository

**Solution**:

1. Have the user re-authorize the add-on
2. Verify the user has access to the repository on GitHub
3. Check that the `repo` scope is requested during authorization

## Security Best Practices

### Protecting Your Credentials

- **Never commit credentials**: Don't include Client ID or Secret in source code
- **Use Script Properties**: Always store credentials in Google Apps Script
  Script Properties
- **Rotate regularly**: Update your Client Secret periodically
- **Monitor access**: Check your OAuth App's usage in GitHub settings

### Separate Environments

For production use, consider creating separate GitHub OAuth Apps for:

- **Development/Testing**: For local testing and development deployments
- **Production**: For your public or shared deployment

This allows you to:

- Use different callback URLs for each environment
- Revoke access to one environment without affecting the other
- Track usage separately

### Limiting Access

- Only share your Apps Script project with trusted collaborators
- Review and audit who has access to Script Properties
- Monitor the OAuth App's authorized users in GitHub

## Additional Resources

- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Google Apps Script Properties
  Service](https://developers.google.com/apps-script/reference/properties)
- [Deployment Guide](DEPLOYMENT.md) - How to deploy the add-on
- [Project Repository](https://github.com/ianlewis/github-smart-chips) - Source
  code and issues
