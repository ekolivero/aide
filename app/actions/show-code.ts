"use server";

import { promises as fs } from "fs";

export async function getCode({ path }: { path: string }) {
  const content = await fs.readFile(path.split(":")[0], "utf-8");

  return content;
}
