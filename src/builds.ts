#!/usr/bin/env node

import { spawn, execSync } from "child_process";
import prompts from "prompts";
import open from "open";

async function main() {
  console.log("Fetching latest builds");
  const ongoingCmd = "gcloud builds list --format=json --ongoing";
  const ongoingBuilds = JSON.parse(execSync(ongoingCmd).toString("utf-8"));
  const buildsCmd = "gcloud builds list --format=json --limit=20";
  const builds = JSON.parse(execSync(buildsCmd).toString("utf-8"));
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

if (require.main === module) {
  main();
}
