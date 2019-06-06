import { spawn } from "child_process"
import { mkdtempSync, writeFileSync } from "fs"
import {tmpdir} from "os"
import { join as joinPath } from "path"

function getPackageJSONContent(name: string): string {
  const json = {
    name,
    version: "1.0.0",
    main: "index.js",
  }
  return JSON.stringify(json)
}

export function createProjectDirectory(): Promise<string> {
  return new Promise((resolve, reject) => {
    const path = mkdtempSync(joinPath(tmpdir(), "try-package-"))
    const name = "try-package-module"
    const packageJSON = getPackageJSONContent(name)
    writeFileSync(joinPath(path, "package.json"), packageJSON)
    resolve(path)
  })
}

export function installModule(path: string, packages: string[], verbose: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const npm = spawn("npm", ["install"].concat(packages), {
      cwd: path,
      stdio: verbose ? "inherit" : "ignore",
    })

    npm.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        const error = new Error(`npm install ${packages.join(" ")} exited with code ${code}`)
        reject(error)
      }
    })
  })
}

export function supportReplAwait(): boolean {
  const version = Number(process.versions.node.split(".")[0])
  return version >= 10
}
