import { defaultNS, resources } from "@/lib/i18n";
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
    returnNull: false;
  }
}
