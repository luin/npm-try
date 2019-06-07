import { expect } from "chai"
import { Mod } from "../src/Mod"

describe("#variableName", () => {
  it("get correct variableName", () => {
    expect(new Mod("ioredis").variableName).to.eql("Redis")
    expect(new Mod("ioredis@2").variableName).to.eql("Redis")
    expect(new Mod("core-js").variableName).to.eql("core")
    expect(new Mod("lodash").variableName).to.eql("lodash")
    expect(new Mod("lodash.assign").variableName).to.eql("assign")
    expect(new Mod("a.js").variableName).to.eql("a")
    expect(new Mod("mod-js").variableName).to.eql("mod")
    expect(new Mod("jsyaml").variableName).to.eql("jsyaml")
    expect(new Mod("js-yaml").variableName).to.eql("yaml")
    expect(new Mod("@angular/core").variableName).to.eql("core")
    expect(new Mod("@angular/core@2.9").variableName).to.eql("core")
  })

  it("get correct packageName", () => {
    expect(new Mod("ioredis").packageName).to.eql("ioredis")
    expect(new Mod("ioredis@2").packageName).to.eql("ioredis")
    expect(new Mod("core-js").packageName).to.eql("core-js")
    expect(new Mod("lodash").packageName).to.eql("lodash")
    expect(new Mod("lodash.assign").packageName).to.eql("lodash.assign")
    expect(new Mod("a.js").packageName).to.eql("a.js")
    expect(new Mod("mod-js").packageName).to.eql("mod-js")
    expect(new Mod("jsyaml").packageName).to.eql("jsyaml")
    expect(new Mod("js-yaml").packageName).to.eql("js-yaml")
    expect(new Mod("@angular/core").packageName).to.eql("@angular/core")
    expect(new Mod("@angular/core@2.9").packageName).to.eql("@angular/core")
  })
})
