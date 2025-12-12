# Self-Hosting Deployment Guide

This guide explains how to self-host and deploy the GitHub Smart Chips add-on
to your own Google Apps Script project.

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

# Install dependencies
npm install

# Build and package the project
make pack
```

This creates a `dist/` directory containing the compiled add-on code ready for
deployment.

### 2. Create Apps Script Project

1. Go to <https://script.google.com/>
2. Click **"New Project"**
3. Give your project a name (e.g., "My GitHub Smart Chips")
4. Click the gear icon (Project Settings) and note your **Script ID** - you'll
   need this for authentication setup

### 3. Set Up Clasp (Google's Apps Script CLI)

```bash
# Install clasp globally
npm install -g @google/clasp

# Login to your Google account
clasp login

# Link your Apps Script project
# Replace <SCRIPT_ID> with your Script ID from step 2
cd dist
clasp clone <SCRIPT_ID>
```

This creates a `.clasp.json` file in the `dist/` directory linking it to your
Apps Script project.

### 4. Create GitHub OAuth App

1. Go to <https://github.com/settings/developers>
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

### 5. Configure Script Properties

1. In your Apps Script project, click the gear icon (Project Settings)
2. Scroll to **"Script Properties"**
3. Click **"Add script property"** and add both:
    - Property: `GITHUB_CLIENT_ID`, Value: Your GitHub OAuth App Client ID
    - Property: `GITHUB_CLIENT_SECRET`, Value: Your GitHub OAuth App Client
      Secret
4. Click **"Save script properties"**

### 6. Deploy to Apps Script

```bash
# From the project root directory
make push
```

This command builds and pushes your code to Google Apps Script.

### 7. Create a Test Deployment

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

## Updating Your Deployment

When you want to update your deployment with the latest code:

```bash
# Pull the latest changes (if using git)
git pull origin main

# Install any new dependencies
npm install

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

### Smart Chips Not Appearing

**Problem**: GitHub URLs don't convert to smart chips.

**Solution**:

- Verify `appsscript.json` is deployed with the correct link preview triggers
- Check the Apps Script logs (View > Logs) for errors
- Ensure the add-on has been authorized

### Build Errors

**Problem**: `make push` fails during build.

**Solution**:

- Ensure you're using the correct Node.js version (check `.node-version`)
- Delete `node_modules` and run `npm install` again
- Check that all prerequisites are installed

### Permission Errors

**Problem**: Clasp commands fail with permission errors.

**Solution**:

- Run `clasp login` again to refresh credentials
- Verify you have edit access to the Apps Script project
- Check that the Script ID in `dist/.clasp.json` is correct

## Security Best Practices

- **Never commit secrets**: Keep your Client ID and Client Secret secure
- **Use Script Properties**: Store all sensitive configuration in Script
  Properties, never in code
- **Rotate credentials regularly**: Update your GitHub OAuth App credentials
  periodically
- **Monitor usage**: Keep track of API usage in your GitHub OAuth App settings
- **Limit access**: Only share your Apps Script project with trusted users

## Advanced: Production Deployment

For a production deployment that doesn't require test mode:

1. In Apps Script, click **"Deploy"** > **"New deployment"**
2. Click the gear icon and select type: **"Editor Add-on"**
3. Configure the deployment:
    - Add a description
    - Set visibility (Only myself, specific users, or anyone with the link)
4. Click **"Deploy"**
5. Note the **Deployment ID** for future updates

To update a production deployment:

```bash
# Build and push code
make push

# In Apps Script, go to Deploy > Manage deployments
# Click the pencil icon on your deployment
# Click "Deploy" to create a new version
```

## Support

For issues, questions, or contributions:

- [Open an issue](https://github.com/ianlewis/github-smart-chips/issues)
- [View documentation](https://github.com/ianlewis/github-smart-chips)
- See [CONFIGURATION.md](CONFIGURATION.md) for detailed configuration options
