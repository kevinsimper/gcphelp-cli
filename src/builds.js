#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const prompts = require("prompts");
const open = require("open");

async function main() {
  console.log("Fetching latest builds");
  const ongoingCmd = "gcloud builds list --format=json --ongoing";
  const ongoingBuilds = JSON.parse(execSync(ongoingCmd));
  const buildsCmd = "gcloud builds list --format=json --limit=20";
  const builds = JSON.parse(execSync(buildsCmd));
  const combined = [ongoingBuilds, builds].flat();
  const buildList = combined.map((item, i) => {
    return {
      title: `${item.status.padEnd(10)}${item.substitutions.REPO_NAME.padEnd(
        40
      )}${item.substitutions.BRANCH_NAME}`,
      value: i,
    };
  });

  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a build",
    choices: buildList,
  });

  if (response.value) {
    console.log(combined[response.value].logUrl);
    open(combined[response.value].logUrl);
  }
}

main();
