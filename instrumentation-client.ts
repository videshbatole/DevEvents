import posthog from "posthog-js";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});

// export function register() {
//   if (process.env.NEXT_RUNTIME === "nodejs") {
//     const exporter = new OTLPLogExporter({
//       url: "https://us.i.posthog.com/otlp/v1/logs",
//       headers: {
//         Authorization:
//           "Bearer phc_mKqGwqi6PPPPXrdGWUsPRFKW7H92SK7tcHK6uaPVV9KH",
//       },
//     });

//     const loggerProvider = new LoggerProvider({
//       resource: resourceFromAttributes({
//         "service.name": "my-nextjs-app",
//       }),
//     });

//     loggerProvider.addLogRecordProcessor(
//       new SimpleLogRecordProcessor(exporter),
//     );

//     // make the logger available globally
//     (globalThis as any).__posthogLogger =
//       loggerProvider.getLogger("my-nextjs-app");
//   }
// }
