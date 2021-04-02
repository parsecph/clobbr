const chalk = require('chalk');
const log = (text: string) => console.log(text);

export const info = (text: string) => log(chalk.gray(text));
export const warn = (text: string) => log(chalk.yellow(text));
export const error = (text: string) => log(chalk.red(text));
export const success = (text: string) => log(chalk.green(text));
export const highlightInfo = (text: string) => log(chalk.white.bgGray(text));
export const highlightError = (text: string) => log(chalk.white.bgRed(text));

export default { info, warn, error, success, highlightInfo, highlightError };
