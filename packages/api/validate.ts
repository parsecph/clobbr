import { EErrors, ERRORS } from './enums/errors';
import { Everbs, VERBS } from './enums/http';

const isAbsoluteUrl = require('is-absolute-url');

export const validate = (url: string, verb: Everbs) => {
  const errors = [];

  if (!validateUrl(url)) {
    errors.push(ERRORS.E0001);
  }

  if (!validateVerb(verb)) {
    errors.push(ERRORS.E0002);
  }

  return {
    valid: errors.length === 0,
    errors
  } as {
    valid: boolean;
    errors: Array<EErrors>;
  };
};

export const validateVerb = (verb: Everbs) =>
  Object.values(VERBS).indexOf(verb) !== -1;
export const validateUrl = (url: string) => isAbsoluteUrl(url);
