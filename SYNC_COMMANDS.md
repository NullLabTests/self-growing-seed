
# Git Sync Commands

Use these commands to sync your local repository with the GitHub repository:

```bash
# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "Update project with live app link and documentation"

# Add remote repository (if not already added)
git remote add origin https://github.com/NullLabTests/RSI-SEED.git

# Push changes to GitHub
git push -u origin main
```

If you're using GitHub CLI, you can also use:

```bash
# Login to GitHub
gh auth login

# Push to the existing repository
gh repo sync NullLabTests/RSI-SEED
```

Remember to replace `main` with your branch name if different.
