import { Octokit } from "@octokit/rest";

let connectionSettings: any;

async function getAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" +
      hostname +
      "/api/v2/connection?include_secrets=true&connector_names=github",
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error("GitHub not connected");
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function pushToGitHub() {
  console.log("Getting GitHub client...");
  const octokit = await getUncachableGitHubClient();

  console.log("Fetching user information...");
  const userResponse = await octokit.users.getAuthenticated();
  const username = userResponse.data.login;

  console.log(`Authenticated as: ${username}`);

  const repoName = "animestream-hub";
  console.log(`Creating repository: ${repoName}`);

  try {
    // Check if repository already exists
    try {
      const existingRepo = await octokit.repos.get({
        owner: username,
        repo: repoName,
      });
      console.log(`Repository ${repoName} already exists.`);
      console.log(`URL: https://github.com/${username}/${repoName}`);
      return;
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
      // Repository doesn't exist, create it
    }

    // Create new repository
    const createRepoResponse = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: "AnimeStream Hub - A modern anime streaming platform",
      private: false,
      auto_init: false,
    });

    console.log(
      `Repository created successfully: ${createRepoResponse.data.html_url}`
    );

    // Initialize git if not already done
    console.log("Initializing git repository...");
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    try {
      // Check if git is already initialized
      await execAsync("git rev-parse --git-dir");
      console.log("Git repository already initialized");
    } catch {
      // Initialize git
      await execAsync("git init");
      console.log("Git repository initialized");
    }

    // Configure git
    await execAsync('git config user.name "AnimeStream"');
    await execAsync('git config user.email "anime@stream.local"');

    // Add all files
    console.log("Adding files to git...");
    await execAsync("git add .");

    // Commit
    console.log("Creating commit...");
    try {
      await execAsync('git commit -m "Initial commit: AnimeStream Hub"');
    } catch {
      console.log("Files already committed or nothing to commit");
    }

    // Add remote and push
    console.log("Adding remote and pushing to GitHub...");
    const remoteUrl = `https://x-access-token:${await getAccessToken()}@github.com/${username}/${repoName}.git`;

    try {
      await execAsync(`git remote add origin ${remoteUrl}`);
    } catch {
      // Remote might already exist
      await execAsync(`git remote set-url origin ${remoteUrl}`);
    }

    await execAsync("git branch -M main");
    await execAsync("git push -u origin main");

    console.log("\n✅ Success! Your project has been pushed to GitHub:");
    console.log(`📍 Repository: https://github.com/${username}/${repoName}`);
    console.log(`🔗 Clone: git clone https://github.com/${username}/${repoName}.git`);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

pushToGitHub().catch(console.error);
