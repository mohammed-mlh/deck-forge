import { resolve } from "node:path";
import { loadEnvFile } from "./lib/load-env";

loadEnvFile(resolve(__dirname, ".."));
