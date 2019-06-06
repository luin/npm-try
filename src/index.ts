import {moveSync, rmdirSync, writeFileSync} from "fs-extra"
import * as meow from "meow"
import * as ora from "ora"
import { join, resolve } from "path"
import * as repl from "repl"
import {Mod} from "./Mod"
import { createProjectDirectory, installModule } from "./utils"

const cli = meow(`
Usage
  $ npm-try [package ..]

Options
  --verbose, -v Verbose mode. Print debugging messages about their progress.
  --out-dir, -o Create a self-contained project with the packages installed in the directory.

Examples
  $ npm-try lodash
  $ npm-try lodash@3
  $ npm-try lodash underscore
  $ npm-try lodash -o my-lodash
  `, {
  flags: {
    verbose: {
      default: false,
      type: "boolean",
      alias: "v",
    },
    outDir: {
      type: "string",
      alias: "o",
    },
  },
  })

async function run() {
  const mods = cli.input.map((target) => new Mod(target))
  const path = await createProjectDirectory()
  const defines: string[] = []
  for (const mod of mods) {
    const spinner = ora(`Installing ${mod.target}...`).start()
    try {
      await installModule(path, [mod.target], cli.flags.verbose)
      const succeed = `const ${mod.variableName} = require('${mod.packageName}')`
      if (cli.flags.outDir) {
        spinner.succeed()
      } else {
        spinner.succeed(succeed)
      }
      defines.push(succeed)
    } catch (err) {
      spinner.fail(`Install ${mod.target} failed. Does package "${mod.packageName}" exist?`)
    }
  }

  if (cli.flags.outDir) {
    createProject(path, cli.flags.outDir, defines)
  } else {
    startREPL(path, mods)
  }
}

function createProject(path: string, to: string, defines: string[]) {
  const spinner = ora(`Creating project at ${to}...`).start()
  to = resolve(process.cwd(), to)
  const content = `'use strict'\n\n${defines.join("\n")}\n\n// Your awesome code here\n`
  try {
    moveSync(path, to)
    writeFileSync(join(to, "index.js"), content)
    spinner.succeed("The project created at " + to)
  } catch (err) {
    spinner.fail(err.message)
  }

}

function startREPL(path: string, mods: Mod[]) {
  const r = repl.start({ prompt: "> " })
  r.on("exit", () => {
    const spinner = ora("Clearing resources...")
    rmdirSync(path)
    spinner.succeed()
  })
  initializeContext()

  function initializeContext() {
    r.context.module.paths.unshift(join(path, "node_modules"))
    mods.forEach((mod) => {
      try {
        const required = r.context.module.require(mod.packageName)
        if (mod.variableName) {
          console.log(Object.keys(r.context))
          r.context[mod.variableName] = required
        }
      } catch (err) {
        /* ignore errors here */
      }
    })
  }
}

run()
