# GitHub Smart Chips Configuration

This document describes the configuration required for the GitHub Smart Chips
add-on.

## Script Properties

The following script properties must be configured in your Google Apps Script
project:

### `GITHUB_CLIENT_ID`

Your GitHub OAuth App Client ID.

**How to get it:**

1. Go to [`https://github.com/settings/developers`](https://github.com/settings/developers)
2. Click on your OAuth App (or create a new one)
3. Copy the Client ID

**Example:**

```text
Iv1.abc123def456
```

### `GITHUB_CLIENT_SECRET`

Your GitHub OAuth App Client Secret.

**How to get it:**

1. Go to [`https://github.com/settings/developers`](https://github.com/settings/developers)
2. Click on your OAuth App
3. Generate a new client secret (or use an existing one)
4. Copy the secret immediately (it won't be shown again)

**Example:**

```text
abc123def456ghi789jkl012mno345pqr678stu901
```

## Setting Script Properties

### Using Apps Script UI

1. Open your Apps Script project
2. Click on the gear icon (Project Settings)
3. Scroll down to "Script Properties"
4. Click "Add script property"
5. Enter the property name and value
6. Click "Save script properties"

### Using clasp

You cannot directly set script properties using clasp, but you can use the Apps
Script API or set them manually in the UI.

## Environment Variables (Development)

For local development and testing, you can create a `.env` file (do not commit
this file):

```bash
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

**Note:** The Apps Script runtime does not use `.env` files. This is only for
reference during development.

## OAuth Scopes

The add-on requests the following OAuth scopes from GitHub:

- `repo`: Full control of private repositories (required to access private
  issues, pull requests, and repositories)

## Security Recommendations

1. **Never commit secrets**: Keep your Client ID and Client Secret secure
2. **Rotate credentials**: Regularly update your GitHub OAuth App credentials
3. **Limit access**: Only grant the minimum necessary OAuth scopes
4. **Monitor usage**: Keep track of API usage and authentication attempts
5. **Use environment-specific apps**: Create separate OAuth Apps for development
   and production

## Troubleshooting

### Invalid Client ID or Secret

- Verify that the script properties are set correctly
- Ensure there are no extra spaces or newlines in the values
- Check that you're using the correct OAuth App

### Callback URL Mismatch

- Verify that the callback URL in your GitHub OAuth App matches the Apps Script
  callback URL
- The callback URL should be in the format:
  `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`

### Permission Denied

- Ensure the OAuth scope includes `repo` for private repositories
- Check that the user has authorized the GitHub OAuth App
- Verify that the user has access to the repository being accessed
