import { EErrors, ERRORS } from '@clobbr/api/src/enums/errors';
import { VERBS } from '@clobbr/api/src/enums/http';
import { stripIndent } from 'common-tags';

const chalk = require('chalk');
const log = (text: string) => console.log(text);

export const info = (text: string) => log(chalk.gray(text));
export const warn = (text: string) => log(chalk.yellow(text));
export const error = (text: string) => log(chalk.red(text));
export const success = (text: string) => log(chalk.green(text));
export const highlightInfo = (text: string) => log(chalk.white.bgGray(text));
export const highlightError = (text: string) => log(chalk.white.bgRed(text));
export const highlightSuccess = (text: string) =>
  log(chalk.white.bgGreen(text));

export const errorMessage = (
  errorCode: EErrors,
  meta: { [key: string]: string | number }
) => {
  const { url, verb } = meta;

  switch (errorCode) {
    case ERRORS.E0001: {
      highlightError(`${url}`);
      error(
        stripIndent`
          Invalid http/https url. Accepted formats:
          ➡️  http://domain.com/optional-path
          ➡️  https://domain.com/optional-path
        `
      );
      break;
    }

    case ERRORS.E0002: {
      highlightError(`${verb}`);
      error(
        stripIndent`
          Invalid http verb. Accepted verbs:
          ➡️  ${Object.values(VERBS)
            .map((v) => stripIndent`${v}`)
            .join(', ')}
        `
      );
      break;
    }

    default:
      highlightError(`An unexpected error occured ${errorMessage}`);
  }
};

export default {
  info,
  warn,
  error,
  success,
  highlightInfo,
  highlightError,
  highlightSuccess
};
