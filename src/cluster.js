#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const prompts = require("prompts");

async function main() {
  const clusters = JSON.parse(
    execSync("gcloud container clusters list --format=json")
  );
  const choices = clusters.map((c, id) => ({ title: c.name, value: id }));
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a cluster",
    choices
  });
  let cmd = `gcloud container clusters get-credentials --region=${
    clusters[response.value].zone
  } ${clusters[response.value].name}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit"
  });
}

main();
