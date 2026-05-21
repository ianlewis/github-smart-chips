# Self-Hosting Guide

This guide explains how to self-host and deploy the GitHub Smart Chips add-on
to your own Google Apps Script project, including all necessary configuration.

There are primarily two ways to self-host the add-on:

1. **For Personal Use**: Deploy the add-on to your own Google account for
   personal use in Google Docs, Sheets, and Slides.
2. **For Organization Use**: Deploy the add-on to a Google Workspace
   organization for use by multiple users within the organization.

Please see the [Limitations](#limitations) section for important considerations
when self-hosting.

## Prerequisites

- A Gmail or Google Workspace account
- Node.js (see `.node-version` file for required version)
- npm (comes with Node.js)
- Make (for build automation)
- A GitHub account (to create a GitHub App)

## Fork the Repository

Fork the repository with the "Fork" button at the top right of the GitHub
repository page.

You can also create a fork with the GitHub CLI:

```bash
gh repo fork ianlewis/github-smart-chips --clone=true
cd github-smart-chips
```

## Self-Hosting for Personal Use

### Create a Google Cloud Project

1. Follow the instructions in the
   [Google Cloud documentation](https://docs.cloud.google.com/resource-manager/docs/creating-managing-projects)
   to create a new Google Cloud project.
2. Navigate to the **APIs & Services** > **OAuth consent screen** page in the
   Google Cloud Console.
3. If you are setting up the app for personal user, select **External** user
   type. If you are setting up the app for Google Workspace organization use,
   select **Internal** user type.
4. Click **Create**.
5. Fill in the required fields (e.g., App name, User support email) and click
   **Save and continue**.
6. Skip the scopes configuration and click **Save and continue**.
7. If using this add-on only for yourself, you can share the add-on with other
   users by adding their email addresses as test users.
8. Click **Save and continue**.
9. Navigate to the **IAM & Admin > Settings** page in the Google Cloud
   Console.
10. Note the **Project number** value. You will need it to link your Google Cloud
    project to your Apps Script project.

### Enable the Apps Script API

1. Follow the instructions in the [Google Apps Script API
   documentation](https://developers.google.com/apps-script/api/how-tos/enable)
   to enable the Apps Script API for your Google account.

### Create the Apps Script Project

1. Authenticate with Google Apps Script CLI

    This step will run `clasp` to authenticate with your Google account. It installs
    a `.clasprc.json` file in your home directory with your credentials.

    ```bash
    make login
    ```

2. Create Apps Script Project

    Create a new Apps Script project. This will update the `.clasp.json` file in
    your project root with the new Script ID.

    ```bash
    make script
    ```

    Be sure to commit the changes to `.clasp.json` to your repository fork.

    ```bash
    git commit .clasp.json -m "chore: update Apps Script project"
    ```

3. Build and Deploy the Code

    This will build the project and push the code to your Apps Script project.

    ```bash
    make push
    ```

### Configure Apps Script Project

1. Go to your Apps Script project in the Google Apps Script editor.

    ```bash
    make goto-apps-script
    ```

2. Click the gear icon (**Project Settings**).
3. Under **Google Cloud Platform Project**, click **Change project**.
4. Enter the project number of the Google Cloud project you created earlier and
   click **Set project**.
5. Copy the **Script ID** value. You will need it to set the GitHub App
   callback URL.

### Create a GitHub App

The add-on requires a GitHub App to authenticate users and access repository
data. Follow these steps to create one:

1. To create a GitHub App owned by your user, go to [your user's GitHub
   Developer Settings](https://github.com/settings/developers). For an
   organization-owned app, navigate to your organization's account settings,
   expand the **Developer Settings** in the left sidebar and click **"GitHub
   Apps"**.
2. Click **"New GitHub App"**.
3. Fill in the following details:
    - **Application name**: `Smart Chips for GitHub` (or your preferred name)
    - **Homepage URL**: The URL of your fork or the original repository.
    - **Authorization callback URL**:
      `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
        - Replace `{SCRIPT_ID}` with the Apps Script **Script ID**.
    - **Request user authorization (OAuth) during installation**: Leave
      unchecked.
    - **Enable Device Flow**: Leave unchecked.
4. **Webhook > Active**: Uncheck
5. **Permissions**: Set the following permissions:
    - **Issues**: Read-only
    - **Metadata**: Read-only
    - **Projects**: Read-only
    - **Pull requests**: Read-only
6. **Subscribe to events**: No events need to be subscribed to for this add-on,
   so leave all unchecked.
7. **Where can this GitHub App be installed?**: Choose "Any account".
8. Click **Create GitHub App**.
9. Copy the **Client ID**.
10. Click **Generate a client secret** and copy the generated secret value.

### Add OAuth Credentials to Apps Script

1. In your Apps Script project, click the gear icon (**Project Settings**).
2. Scroll to **"Script Properties"**.
3. Click **"Add script property"** and add both:
    - Property: `GITHUB_CLIENT_ID`, Value: Your GitHub App Client ID
    - Property: `GITHUB_CLIENT_SECRET`, Value: Your GitHub App Client Secret
4. Click **"Deploy"** > **"Test deployments"** in the upper right.
5. Click **"Install"** and grant the necessary permissions when prompted.

### Create a Test Deployment

Create a test deployment to use the add-on. The deployment will always use the
latest version of the code in your Apps Script project.

1. In your Apps Script project, click **"Deploy"** > **"Test deployments"**
2. Click **"Install"**
3. Grant the necessary permissions when prompted
4. Open a Google Doc to test the add-on

## Self-Hosting for Organization Use

To deploy the add-on for a Google Workspace organization, follow the same steps
as [above](#self-hosting-for-personal-use), but ensure you are logged into the
Google Workspace account when creating the Apps Script project and deploying the
add-on.

## Publish the Add-on for Organization Use

Follow the
[instructions](https://developers.google.com/workspace/marketplace/how-to-publish)
in the Google Workspace documentation to publish the add-on within your
organization. Make sure to publish the application privately to your
organization.

### Updating via GitHub Actions

You can use `clasp` to deploy updates to your Apps Script project as needed.

1. Go to your repository settings and go to the "Secrets and variables" >
   "Actions" section.
2. Add the following secrets:
    - `APPSSCRIPT_DEPLOYMENT_ID`: Your Apps Script project deployment ID (found
      in the Apps Script editor under **Deploy** > **Manage deployments**).
    - `CLASP_CREDENTIALS`: Your `~/.clasprc.json` file content (created during
      `make login`).
3. Create a new GitHub release to trigger the deployment workflow.
4. The GitHub Actions workflow will build and deploy the latest code to your
   Apps Script project as a new version to your production deployment. Users
   will be updated automatically.

## Limitations

- **Marketplace Publishing**: Due to Google Workspace Marketplace restrictions,
  this add-on cannot be published publicly (unless you are affiliated with
  GitHub). They can only be used within your own account or organization.
- **Personal Use**: When self-hosting for personal use, only the users you share
  the add-on with can use the add-on. It isn't recommended to use with
  documents shared with other users.
- **Test users**: Only users with edit access will be able to install the test
  deployment.
- **Organization Use**: When self-hosting for a Google Workspace organization,
  the add-on can be shared with multiple users, but all users must authorize
  the add-on individually to access GitHub data.

## Additional Resources

- [GitHub Apps Documentation](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps)
- [Google Apps Script Properties Service](https://developers.google.com/apps-script/reference/properties)
