"use server";

import { promises as fs } from "fs";
import dedent from "dedent";
import { generateText, tool } from 'ai'
import { anthropic } from "@ai-sdk/anthropic"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getFileSystem({ path, request }: { path: string, request: string }) {
    const content = await fs.readFile(path.split(":")[0], 'utf-8')

    await delay(1000);

    const { text } = await generateText({
        model: anthropic("claude-3-5-sonnet-20240620"),
        prompt: dedent`
            Your goal is to generate a working code snipped that will be executed without any human intervention. You should return only the code, no additional text. Don't mark '''js/tsx return only the code.
            You should be able to achieve this referring to the current code ${content} and the following user request: ${request}
        `,
    });

    await fs.writeFile(path.split(":")[0], text, 'utf-8')

    return content
}