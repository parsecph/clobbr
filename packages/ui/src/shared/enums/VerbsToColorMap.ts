import { VERBS } from 'shared/enums/http';

export const VERB_COLOR_CLASS_MAP = {
  [VERBS.GET]: 'bg-blue-200',
  [VERBS.POST]: 'bg-green-200',
  [VERBS.PUT]: 'bg-orange-200',
  [VERBS.HEAD]: 'bg-purple-200',
  [VERBS.DELETE]: 'bg-red-200',
  [VERBS.PATCH]: 'bg-yellow-200'
};
