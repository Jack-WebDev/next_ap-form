import { SSTConfig } from "sst";
import { NextjsSite, Config } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "next-ap-form",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const edgeStoreSecret = new Config.Secret(stack, "edgeStoreSecret");
      const site = new NextjsSite(stack, "site", {
        bind: [edgeStoreSecret]
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
