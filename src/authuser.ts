#!/usr/bin/env node

import prompts from "prompts";
import { getAuthuser, setAuthuser } from "./helper/config";

async function main() {
  console.log("Authuser is", getAuthuser());
  const response = await prompts({
    type: "number",
    name: "value",
    message: "Write a authuser id to change it",
  });

  if (response.value !== undefined) {
    console.log("Setting authuser");
    setAuthuser(response.value);
  }
}

if (require.main === module) {
  main();
}
