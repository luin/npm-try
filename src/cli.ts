#!/usr/bin/env node

import chalk from "chalk"
import { spawn } from "child_process"
import { rmdirSync } from "fs-extra"
import { join } from "path"
import { supportReplAwait } from "./utils"

const args = [join(__dirname, "index")].concat(process.argv.slice(2))

if (supportReplAwait()) {
  args.unshift("--experimental-repl-await")
} else {
  console.log(chalk.yellow(`support for "await" is disabled (required Node.js >= 10, current ${process.version}).`))
}

spawn("node", args, {
  stdio: "inherit",
})
