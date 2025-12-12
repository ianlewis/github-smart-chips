# Self-Hosting Guide

This guide explains how to self-host and deploy the GitHub Smart Chips add-on
to your own Google Apps Script project, including all necessary configuration.

## Prerequisites

- A Google account
- Node.js (see `.node-version` file for required version)
- npm (comes with Node.js)
- Make (for build automation)
- A GitHub account (to create an OAuth App)

## Quick Start

### 1. Clone and Build

```bash
# Clone the repository
git clone https://github.com/ianlewis/github-smart-chips.git
cd github-smart-chips

# Build and package the project
make pack
```

This creates a `dist/` directory containing the compiled add-on code ready for
deployment.

### 2. Create Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click **"New Project"**
3. Give your project a name (e.g., "My GitHub Smart Chips")
4. Click the gear icon (Project Settings) and note your **Script ID** - you'll
   need this for authentication setup

### 3. Authenticate with Google Apps Script

Authenticate with your Google account to enable deployment:

```bash
# Login to your Google account
make clasp-login
```

This will open a browser window for you to authorize access to your Google
account.

### 4. Configure Script ID

Update the `.clasp.json` file in the project root with your Apps Script
project's Script ID:

```json
{
    "scriptId": "YOUR_SCRIPT_ID_HERE"
}
```

Replace `YOUR_SCRIPT_ID_HERE` with your actual Script ID from step 2.

**Note**: The build process automatically copies this file to the `dist/`
directory where clasp uses it for deployment.

### 5. Create GitHub OAuth App

The add-on requires a GitHub OAuth App to authenticate users and access
repository data.

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
    - **Application name**: `GitHub Smart Chips` (or your preferred name)
    - **Homepage URL**: `https://github.com/ianlewis/github-smart-chips` (or
      your fork)
    - **Authorization callback URL**:
      `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
        - Replace `{SCRIPT_ID}` with your actual Script ID from step 2
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy the **Client Secret**
   immediately (it won't be shown again)

#### OAuth Credential Formats

- **Client ID**: Starts with `Iv1.` followed by alphanumeric characters
    - Example: `Iv1.abc123def456`
- **Client Secret**: A 40-character hexadecimal string
    - Example: `abc123def456ghi789jkl012mno345pqr678stu901`

#### OAuth Scopes

The add-on requests the `repo` scope from GitHub, which is required to:

- Access public repositories
- Access private repositories (if the user has permission)
- Fetch issue and pull request details

Users will be prompted to authorize this scope when they first use the add-on.

### 6. Configure Script Properties

Script properties are used to securely store your GitHub OAuth credentials in
Apps Script.

1. In your Apps Script project, click the gear icon (Project Settings)
2. Scroll to **"Script Properties"**
3. Click **"Add script property"** and add both:
    - Property: `GITHUB_CLIENT_ID`, Value: Your GitHub OAuth App Client ID
    - Property: `GITHUB_CLIENT_SECRET`, Value: Your GitHub OAuth App Client
      Secret
4. Click **"Save script properties"**

**Important**: Property names are case-sensitive and must be exactly
`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

### 7. Deploy to Apps Script

```bash
# From the project root directory
make push
```

This command builds and pushes your code to Google Apps Script.

### 8. Create a Test Deployment

1. In your Apps Script project, click **"Deploy"** > **"Test deployments"**
2. Click **"Install"**
3. Grant the necessary permissions when prompted
4. Open a Google Doc to test the add-on

## Using the Add-on

1. Open or create a Google Doc
2. Paste a GitHub issue or PR URL (e.g.,
   `https://github.com/owner/repo/issues/123`)
3. The URL will automatically convert to a smart chip showing the issue/PR
   details

## Verifying Your Setup

After completing the setup:

1. Open a Google Doc
2. Try pasting a GitHub issue URL (e.g.,
   `https://github.com/octocat/Hello-World/issues/1`)
3. If prompted, authorize the add-on to access GitHub
4. The URL should convert to a smart chip with issue details

## Updating Your Deployment

When you want to update your deployment with the latest code:

```bash
# Pull the latest changes (if using git)
git pull origin main

# Build and deploy
make push
```

## Troubleshooting

### Authentication Issues

**Problem**: OAuth authentication fails or redirects to the wrong URL.

**Solution**:

- Verify the callback URL in your GitHub OAuth App exactly matches:
  `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
- Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly in
  Script Properties
- Check for extra spaces or newlines in the property values
- Verify property names are exactly `GITHUB_CLIENT_ID` and
  `GITHUB_CLIENT_SECRET` (case-sensitive)

### Invalid Client ID or Secret

**Problem**: Error message about invalid credentials.

**Causes**:

- Script properties are not set
- Property names are misspelled (they are case-sensitive)
- Extra spaces or newlines in the values

**Solution**:

1. Verify property names are exactly `GITHUB_CLIENT_ID` and
   `GITHUB_CLIENT_SECRET`
2. Check that values don't have trailing spaces or newlines
3. Try copying and pasting the values again from GitHub

### Callback URL Mismatch

**Problem**: OAuth redirect fails with a mismatch error.

**Causes**:

- The callback URL in your GitHub OAuth App doesn't match your Apps Script
  project

**Solution**:

1. Get your Script ID from Apps Script Project Settings
2. Update the callback URL in your GitHub OAuth App to:
   `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
3. Make sure to replace `{SCRIPT_ID}` with your actual Script ID

### Smart Chips Not Appearing

**Problem**: GitHub URLs don't convert to smart chips.

**Solution**:

- Verify `appsscript.json` is deployed with the correct link preview triggers
- Check the Apps Script logs (View > Logs) for errors
- Ensure the add-on has been authorized

### Access Denied to Private Repositories

**Problem**: Cannot access private repositories.

**Causes**:

- The OAuth App hasn't been authorized for the user
- The user doesn't have access to the repository

**Solution**:

1. Have the user re-authorize the add-on
2. Verify the user has access to the repository on GitHub
3. Check that the `repo` scope is requested during authorization

### Build Errors

**Problem**: `make push` fails during build.

**Solution**:

- Ensure you're using the correct Node.js version (check `.node-version`)
- Delete `node_modules` and run `npm install` again
- Check that all prerequisites are installed

### Permission Errors

**Problem**: Clasp commands fail with permission errors.

**Solution**:

- Run `make clasp-login` again to refresh credentials
- Verify you have edit access to the Apps Script project
- Check that the Script ID in `.clasp.json` (in the project root) is correct

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

## Advanced: Production Deployment

For a production deployment that doesn't require test mode:

1. In Apps Script, click **"Deploy"** > **"New deployment"**
2. Click the gear icon and select type: **"Editor Add-on"**
3. Configure the deployment:
    - Add a description
    - Set visibility (Only myself, specific users, or anyone with the link)
4. Click **"Deploy"**
5. Note the **Deployment ID** for future updates

To create a new production deployment:

```bash
# Set a version name/tag for the deployment
export GITHUB_REF_NAME="v1.0.0"

# Create a new deployment
make create-deployment
```

The deployment will be created with the description from `GITHUB_REF_NAME`.

## Additional Resources

- [GitHub OAuth Apps
  Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Google Apps Script Properties
  Service](https://developers.google.com/apps-script/reference/properties)

## Support

For issues, questions, or contributions:

- [Open an issue](https://github.com/ianlewis/github-smart-chips/issues)
- [View documentation](https://github.com/ianlewis/github-smart-chips)
