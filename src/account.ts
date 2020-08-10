#!/usr/bin/env node

import { spawn, execSync } from "child_process";
import prompts from "prompts";

async function main() {
  const accounts = JSON.parse(
    execSync("gcloud auth list --format=json").toString()
  );
  const choices = accounts.map((c, id) => ({
    title: `${c.account} - ${c.status}`,
    value: id,
  }));
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a account",
    choices,
  });
  console.log(response);
  if (response.value !== undefined) {
    let cmd = `gcloud auth login ${accounts[response.value].account}`;
    console.log(cmd);
    spawn(cmd, {
      shell: true,
      stdio: "inherit",
    });
  }
}

if (require.main === module) {
  main();
}
