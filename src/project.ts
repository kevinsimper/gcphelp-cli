#!/usr/bin/env node

import { spawn, execSync } from "child_process";
import prompts from "prompts";

export async function getProjects() {
  const projects = JSON.parse(
    execSync("gcloud projects list --format=json").toString("utf-8")
  );
  return projects;
}

export async function main() {
  const projects = await getProjects();
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
  if (response.value !== undefined) {
    let cmd = `gcloud config set project ${projects[response.value].projectId}`;
    console.log(cmd);
    const output = execSync(cmd).toString("utf-8");
    console.log(output);
  }
}

if (require.main === module) {
  main();
}
