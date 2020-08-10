#!/usr/bin/env node

import { spawn, execSync } from "child_process";
import prompts from "prompts";

async function main() {
  const projects = JSON.parse(execSync("gcloud projects list --format=json").toString('utf-8'));
  const choices = projects.map((c, id) => ({
    title: `${c.name} - ${c.projectId}`,
    value: id,
  }));
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a project",
    choices,
  });
  let cmd = `gcloud config set project ${projects[response.value].projectId}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit",
  });
}

main();
