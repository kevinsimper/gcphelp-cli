#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const prompts = require("prompts");

async function main() {
  const namespaces = JSON.parse(
    execSync("kubectl get ns -o=json")
  );
  const choices = namespaces.items.map((c, id) => ({ title: c.metadata.name, value: id }));
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a namespace",
    choices
  });
  let ns = namespaces.items[response.value].metadata.name
  let cmd = `kubectl config set-context $(kubectl config current-context) --namespace=${ns}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit"
  });
}

main();
