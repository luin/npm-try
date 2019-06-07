import famous from "./famous"

function getVariableNameFromPackage(packageName: string): string {
  packageName = packageName.toLowerCase()
  if (typeof famous[packageName] === "string") {
    return famous[packageName]
  }

  if (packageName[0] === "@") {
    packageName = packageName.slice(1)
  }

  packageName = packageName.replace(/[\.\-]js$/, "")
  packageName = packageName.replace(/^js-/, "")

  if (packageName.match(/^\w[\w\d]*$/)) {
    return packageName
  }

  const dots = packageName.split(/[\/\.]/)
  if (dots.length > 0) {
    packageName = dots[dots.length - 1]
  }
  const words = packageName.split("-").map((word, index) => {
    if (index === 0 || !word) {
      return word
    }
    return word[0].toUpperCase() + word.slice(1)
  })

  return words.join("")
}

export class Mod {
  public readonly packageName: string
  public readonly variableName: string

  constructor(readonly target: string) {
    const versionIndex = target.lastIndexOf("@")
    if (versionIndex > 0) {
      this.packageName = target.slice(0, versionIndex)
    } else {
      this.packageName = target
    }
    this.variableName = getVariableNameFromPackage(this.packageName)
  }
}
