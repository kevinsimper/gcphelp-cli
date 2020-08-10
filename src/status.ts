import { spawn, execSync } from "child_process";

export async function getConfig() {
  const cmd = `gcloud config list --format=json`;
  const config = JSON.parse(execSync(cmd).toString("utf-8"));
  return config;
}

async function main() {
  const config = await getConfig();
  console.log(config);
}

if (require.main === module) {
  main();
}
