#!/usr/bin/env node

import { spawn, execSync } from "child_process";
import prompts from "prompts";

async function main() {
  const namespaces = JSON.parse(execSync("kubectl get ns -o=json").toString('utf-8'));
  const choices = namespaces.items.map((c, id) => ({
    title: c.metadata.name,
    value: id,
  }));
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a namespace",
    choices,
  });
  let ns = namespaces.items[response.value].metadata.name;
  let cmd = `kubectl config set-context $(kubectl config current-context) --namespace=${ns}`;
  console.log(cmd);
  spawn(cmd, {
    shell: true,
    stdio: "inherit",
  });
}

main();
