# Deployment Guide

This guide explains how to deploy the GitHub Smart Chips add-on to Google Apps
Script.

## Prerequisites

1. A Google account
2. A GitHub OAuth App (for authentication)
3. Node.js and npm installed locally

## Setup GitHub OAuth App

1. Go to <https://github.com/settings/developers>
2. Click "New OAuth App"
3. Fill in the application details:
    - **Application name**: GitHub Smart Chips
    - **Homepage URL**: Your app's homepage (can be a GitHub repo)
    - **Authorization callback URL**: The Apps Script callback URL (you'll get
      this later)
4. Click "Register application"
5. Note down the **Client ID**
6. Generate a new **Client Secret** and save it securely

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

## Add OAuth2 Library

The OAuth2 library is required for GitHub authentication.

1. In your Apps Script project, click the "+" next to Libraries
2. Enter the Script ID: `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF`
3. Click "Look up"
4. Select the latest version (version 44 or higher)
5. Click "Add"

**Note:** Verify the library ID and version in the [official OAuth2 for Apps
Script
repository](https://github.com/googleworkspace/apps-script-oauth2#readme).

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

## Get Callback URL

1. In your Apps Script project, run the following function once to get the
   callback URL:

    ```javascript
    function getCallbackUrl() {
        Logger.log(
            ScriptApp.getService()
                .getUrl()
                .replace("/macros/s/", "/usercallback/"),
        );
    }
    ```

2. Copy the logged URL
3. Go back to your GitHub OAuth App settings
4. Update the "Authorization callback URL" with the URL you just copied

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
- Check that script properties are set correctly
- Make sure the OAuth2 library is added and the correct version is selected

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

## Support

For issues and questions, please open an issue on the GitHub repository.
