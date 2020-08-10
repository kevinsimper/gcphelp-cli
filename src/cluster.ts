#!/usr/bin/env node

import { fork, spawn, execSync } from "child_process";
import { join } from "path";
import prompts from "prompts";
import { main as chooseProject } from "./project";

function getCredentials(cluster) {
  let cmd = `gcloud container clusters get-credentials --region=${cluster.zone} ${cluster.name}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit",
  });
}

async function main() {
  const clusters = JSON.parse(
    execSync("gcloud container clusters list --format=json").toString("utf-8")
  );
  const choices = clusters.map((c, id) => ({ title: c.name, value: id }));
  choices.push({
    title: "→ Choose other project",
    value: "other",
  });
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a cluster",
    choices,
  });

  switch (response.value) {
    case "other":
      await chooseProject();
      await main();
    default:
      return getCredentials(clusters[response.value]);
  }
}

if (require.main === module) {
  main();
}
