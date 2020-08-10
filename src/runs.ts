#!/usr/bin/env node

import { execSync } from "child_process";
import prompts from "prompts";
import open from "open";
import { main as chooseProject } from "./project";
import { getConfig } from "./status";
import { getAuthuser } from "./helper/config";

async function getServices() {
  const services = JSON.parse(
    execSync("gcloud run services list --format=json").toString("utf-8")
  );
  return services;
}

async function main() {
  console.log("Getting Cloud Runs");
  const start = Date.now();
  const services = await getServices();
  console.log(`It took ${((Date.now() - start) / 1000).toFixed(2)} sec`);
  const choices = services.map((c, id) => ({
    title: `${c.metadata.name} - #${c.metadata.generation}`,
    value: id,
  }));
  choices.push({
    title: "Other project",
    value: "other",
  });
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick a service",
    choices,
  });
  if (response.value === "other") {
    await chooseProject();
    return await main();
  }
  if (response.value !== undefined) {
    const config = await getConfig();
    const service = services[response.value];
    console.log({ service });
    let url = `https://console.cloud.google.com/run/detail/${
      service.metadata.labels["cloud.googleapis.com/location"]
    }/${service.metadata.name}/revisions?authuser=${getAuthuser()}&project=${
      config.core.project
    }`;
    open(url);
  }
}

if (require.main === module) {
  main();
}
