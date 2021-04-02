const isAbsoluteUrl = require('is-absolute-url');

export const validate = (url: string) => isAbsoluteUrl(url);
