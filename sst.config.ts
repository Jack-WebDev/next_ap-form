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
      const EDGE_STORE_ACCESS_KEY = new Config.Secret(stack, "EDGE_STORE_ACCESS_KEY");
      const TEST_VAL = new Config.Secret(stack, "TEST_VAL");
      const site = new NextjsSite(stack, "site", {
        bind: [EDGE_STORE_ACCESS_KEY, TEST_VAL]
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
