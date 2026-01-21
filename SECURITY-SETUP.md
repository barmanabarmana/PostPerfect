# Security Setup Guide

## Important: API Key Configuration

This project requires an Anthropic API key to function. Follow these steps to set it up securely:

### 1. Create Local Configuration File

Copy the example configuration file:

```bash
cd PostPerfect.Api
cp appsettings.Development.json.example appsettings.Development.json
```

### 2. Add Your API Key

Edit `PostPerfect.Api/appsettings.Development.json` and replace `YOUR_ANTHROPIC_API_KEY_HERE` with your actual Anthropic API key:

```json
{
  "Claude": {
    "ApiKey": "sk-ant-api03-YOUR_ACTUAL_KEY_HERE"
  }
}
```

### 3. Verify .gitignore

The `.gitignore` file is already configured to exclude sensitive files. Verify it includes:

```
appsettings.Development.json
*.env
*.key
bin/
obj/
```

### 4. Never Commit Secrets

**NEVER** commit files containing:
- API keys
- Passwords
- Database connection strings
- Any sensitive credentials

### 5. If You Accidentally Committed a Secret

If you accidentally committed an API key:

1. **Immediately revoke the exposed key** at https://console.anthropic.com/
2. Generate a new API key
3. Update your local `appsettings.Development.json` with the new key
4. Clean Git history (if needed):
   ```bash
   # Use git filter-repo or BFG Repo-Cleaner
   # Or contact GitHub support to fully remove the commit
   ```

## Getting an Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Generate a new key
5. Copy it to your `appsettings.Development.json`

## Project Structure

- `appsettings.json` - Public configuration (committed to Git)
- `appsettings.Development.json` - Private configuration with secrets (NOT committed)
- `appsettings.Development.json.example` - Template for local setup (committed)

## For Team Members

When setting up the project:

1. Clone the repository
2. Copy `appsettings.Development.json.example` to `appsettings.Development.json`
3. Add your own API key
4. Never commit the `appsettings.Development.json` file
