import { config } from "./config/Config";
import util from "util";

/**
 * Logs the given message if the log level in the config is set at minimum to the given value
 * 
 * Log levels (0 no log):
 * 1. critical errors
 * 2. all errors
 * 3. warnings
 * 4. basic system status
 * 5. all status messages
 * 6. basic processed data
 * 7. all data
 * 10. all log
 * 
 * Currently this logs to the console; TODO: Add other log options
 * 
 * @param logLevel The minimum log level for the given message to be logged
 * @param text The text/data to be logged. This can contain formatting as in `console.log`
 * @param args The data to fill into the formatting. See `console.log`
 */
export function log(logLevel: number, text: any, ...args: any) {
    if (config.common.logLevel >= logLevel) {
        if (args.length > 0) {
            console.log(text, args);
        } else {
            console.log(text);
        }
    }
}