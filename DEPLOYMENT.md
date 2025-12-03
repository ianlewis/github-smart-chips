# Deployment Guide

This guide explains how to deploy the GitHub Smart Chips add-on to Google Apps
Script.

## Prerequisites

1. A Google account
2. A GitHub OAuth App (for authentication)
3. Node.js and npm installed locally

## Build the Project

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build
# or
make build
```

This will generate JavaScript files in the `lib/` directory.

## Create Apps Script Project

1. Go to <https://script.google.com/>
2. Click "New Project"
3. Give your project a name (e.g., "GitHub Smart Chips")
4. Note the **Script ID** from the project settings (gear icon) - you'll need
   this for the GitHub OAuth App callback URL

## Setup GitHub OAuth App

1. Go to <https://github.com/settings/developers>
2. Click "New OAuth App"
3. Fill in the application details:
    - **Application name**: GitHub Smart Chips
    - **Homepage URL**: Your app's homepage (can be a GitHub repo)
    - **Authorization callback URL**:
      `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback` (replace
      `{SCRIPT_ID}` with your Apps Script project's Script ID from the previous
      step)
4. Click "Register application"
5. Note down the **Client ID**
6. Generate a new **Client Secret** and save it securely

## Upload Files

Use `clasp` to deploy the code to Google Apps Script.

```bash
# Install clasp
npm install -g @google/clasp

# Login to Google
clasp login

# Create or clone your project
clasp create --type docs --title "GitHub Smart Chips"
# or
clasp clone <SCRIPT_ID>

# Copy files to the project directory
cp lib/*.js <clasp-project-directory>/
cp appsscript.json <clasp-project-directory>/

# Push to Apps Script
cd <clasp-project-directory>
clasp push
```

## Configure Script Properties

1. In Apps Script, go to Project Settings (gear icon)
2. Scroll to "Script Properties"
3. Add the following properties:
    - **GITHUB_CLIENT_ID**: Your GitHub OAuth App Client ID
    - **GITHUB_CLIENT_SECRET**: Your GitHub OAuth App Client Secret

## Deploy as Add-on

### Test Deployment

1. In Apps Script, click "Deploy" > "Test deployments"
2. Select "Install"
3. Grant the necessary permissions
4. Open a Google Doc to test the add-on

### Production Deployment

1. Click "Deploy" > "New deployment"
2. Select type: "Add-on"
3. Configure the deployment settings
4. Click "Deploy"

## Testing

1. Open a Google Doc
2. The add-on should appear in the Add-ons menu
3. Paste a GitHub issue or PR URL (e.g.,
   `https://github.com/owner/repo/issues/123`)
4. You should see a smart chip with the issue/PR information

## Troubleshooting

### Authentication Issues

- Ensure the GitHub OAuth App callback URL matches the Apps Script callback URL
  format: `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
- Check that script properties are set correctly
- Verify that the OAuth2 library is properly configured in `appsscript.json`

### Smart Chips Not Appearing

- Verify that the link preview triggers are configured in `appsscript.json`
- Check that the URL pattern matches the GitHub issue/PR format
- Ensure the add-on has the necessary OAuth scopes

### API Errors

- Check the Apps Script logs for error messages
- Verify that your GitHub token has the required permissions
- Ensure the GitHub API rate limits haven't been exceeded

## Security Notes

- Never commit your GitHub Client Secret to source control
- Use Script Properties to store sensitive information
- Regularly rotate your GitHub OAuth App credentials
- Monitor the add-on's API usage

## Automated Deployment via GitHub Actions

The project includes a GitHub Actions workflow that automatically deploys to
Google Apps Script when a new release is created.

### Setup for Automated Deployment

The deployment workflow uses clasp credentials stored as a GitHub secret.

**Note:** Google Apps Script API does not support service accounts, so Workload
Identity Federation cannot be used for deployment. See
[google/clasp#1051](https://github.com/google/clasp/issues/1051) and
[Issue 442055772](https://issuetracker.google.com/issues/442055772) for more
details.

1. **Generate clasp credentials**:

    ```bash
    # Login to Google
    clasp login
    ```

    This creates a `.clasprc.json` file in your home directory containing OAuth
    credentials.

2. **Add credentials to GitHub Secrets**:
    - Go to your GitHub repository settings
    - Navigate to **Secrets and variables** > **Actions** > **Secrets** tab
    - Click **New repository secret**
    - Name: `CLASP_CREDENTIALS`
    - Value: Copy the entire contents of your `~/.clasprc.json` file
    - Click **Add secret**

### Deployment Triggers

The workflow can be triggered in two ways:

1. **Automatically on release creation**:

    When you create a new release on GitHub, the deployment workflow will
    automatically:
    - Build the TypeScript code
    - Package the distribution files
    - Deploy to Google Apps Script using `make deploy`

2. **Manually via `workflow_dispatch`**:

    You can manually trigger the deployment from the Actions tab:
    - Go to the **Actions** tab in your repository
    - Select the **deploy** workflow
    - Click **Run workflow**

### Security Notes for CI/CD

- The `CLASP_CREDENTIALS` secret contains OAuth tokens - keep it secure
- Never commit `.clasprc.json` to the repository
- Regularly review and rotate credentials if needed
- The workflow only runs on release events or manual triggers for safety

## Support

For issues and questions, please open an issue on the GitHub repository.
