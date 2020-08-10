#!/usr/bin/env node

import { fork, spawn, execSync } from "child_process";
import { join } from "path";
import prompts from "prompts";

function getCredentials(cluster) {
  let cmd = `gcloud container clusters get-credentials --region=${cluster.zone} ${cluster.name}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit",
  });
}

function chooseProject() {
  spawn(join(__dirname, "./project.js"), {
    stdio: "inherit",
  }).on("exit", () => {
    main();
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
      return chooseProject();
    default:
      return getCredentials(clusters[response.value]);
  }
}

if (require.main === module) {
  main();
}
