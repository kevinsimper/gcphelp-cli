#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const prompts = require("prompts");

async function main() {
  const accounts = JSON.parse(execSync("gcloud auth list --format=json"));
  const choices = accounts.map((c, id) => ({
    title: `${c.account} - ${c.status}`,
    value: id
  }));
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a account",
    choices
  });
  console.log(response);
  let cmd = `gcloud auth login ${accounts[response.value].account}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit"
  });
}

main();
