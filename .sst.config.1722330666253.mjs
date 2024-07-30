import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// sst.config.ts
import { NextjsSite } from "sst/constructs";
var sst_config_default = {
  config(_input) {
    return {
      name: "next-ap-form",
      region: "us-east-1"
    };
  },
  stacks(app) {
    app.stack(/* @__PURE__ */ __name(function Site({ stack }) {
      const site = new NextjsSite(stack, "site");
      stack.addOutputs({
        SiteUrl: site.url
      });
    }, "Site"));
  }
};
export {
  sst_config_default as default
};
