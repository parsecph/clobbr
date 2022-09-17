const platform = navigator.platform;
const version = require('../../../package.json').version;
const sanitizeMailBody = (body: string) =>
  body.replace(/(?:\r\n|\r|\n)/g, '%0D%0A');

export const MAX_ITERATIONS = 100;
export const SUPPORT_EMAIL = '04.scale.emus@icloud.com';

export const APP_INFO_TEXT = `


-------------------
Please do not remove the information below.

UI Version: ${version}
Platform: ${platform}
-------------------
`;

const BUG_REPORT_SUBJECT = '[Clobbr] Bug Report';
const FEATURE_REQUEST_SUBJECT = '[Clobbr] Feature Request';
const HELP_SUBJECT = '[Clobbr] Help';

export const BUG_REPORT_HREF = `mailto:${SUPPORT_EMAIL}1?subject=${BUG_REPORT_SUBJECT}&body=${sanitizeMailBody(
  APP_INFO_TEXT
)}`;

export const FEATURE_REQUEST_HREF = `mailto:${SUPPORT_EMAIL}2?subject=${FEATURE_REQUEST_SUBJECT}&body=${sanitizeMailBody(
  APP_INFO_TEXT
)}`;

export const HELP_HREF = `mailto:${SUPPORT_EMAIL}3?subject=${HELP_SUBJECT}&body=${sanitizeMailBody(
  APP_INFO_TEXT
)}`;
