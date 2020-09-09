import { moveSync, writeFileSync } from "fs-extra";
import * as meow from "meow";
import * as ora from "ora";
import { join, resolve } from "path";
import * as repl from "repl";
import { Mod } from "./Mod";
import { createProjectDirectory, installModule } from "./utils";

const cli = meow(
  `
Usage
  $ npm-try [package ..]

Options
  --registry, -r Specify the registry that will be used when npm install.
  --out-dir, -o Create a self-contained project with the packages installed in the directory.
  --verbose, -v Verbose mode. Print debugging messages about their progress.

Examples
  $ npm-try lodash
  $ npm-try lodash@3
  $ npm-try lodash underscore
  $ npm-try lodash -o my-lodash
  `,
  {
    flags: {
      registry: {
        type: "string",
        alias: "r",
      },
      outDir: {
        type: "string",
        alias: "o",
      },
      verbose: {
        default: false,
        type: "boolean",
        alias: "v",
      },
    },
  },
);

async function run() {
  const mods = cli.input.map((target) => new Mod(target));
  const path = await createProjectDirectory();
  const defines: string[] = [];
  let installed = 0;
  for (const mod of mods) {
    const spinner = ora(`Installing ${mod.target}...`).start();
    try {
      await installModule(path, [mod.target], cli.flags);
      const succeed = `const ${mod.variableName} = require('${mod.packageName}')`;
      if (cli.flags.outDir) {
        spinner.succeed();
      } else {
        spinner.succeed(succeed);
      }
      defines.push(succeed);
      installed += 1;
    } catch (err) {
      spinner.fail(
        `Install ${mod.target} failed. Does package "${mod.packageName}" exist?`,
      );
    }
  }

  const success = installed > 0 || mods.length === 0;
  if (!success) {
    process.exit(1);
  }

  if (cli.flags.outDir) {
    createProject(path, cli.flags.outDir, defines);
  } else {
    startREPL(path, mods);
  }
}

function createProject(path: string, to: string, defines: string[]) {
  const spinner = ora(`Creating project at ${to}...`).start();
  to = resolve(process.cwd(), to);
  const content = `'use strict'\n\n${defines.join(
    "\n",
  )}\n\n// Your awesome code here\n`;
  try {
    moveSync(path, to);
    writeFileSync(join(to, "index.js"), content);
    spinner.succeed("The project created at " + to);
  } catch (err) {
    spinner.fail(err.message);
  }
}

function startREPL(path: string, mods: Mod[]) {
  const r = repl.start({ prompt: "> " });
  initializeContext();

  function initializeContext() {
    r.context.module.paths.unshift(join(path, "node_modules"));
    mods.forEach((mod) => {
      try {
        const required = r.context.module.require(mod.packageName);
        if (mod.variableName) {
          r.context[mod.variableName] = required;
        }
      } catch (err) {
        /* ignore errors here */
      }
    });
  }
}

run();
