import clsx from 'clsx';

import { CircularProgress } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { ReactComponent as ParallelIcon } from 'shared/icons/Parallel.svg';
import { ReactComponent as SequenceIcon } from 'shared/icons/Sequence.svg';

import { VERB_COLOR_CLASS_MAP } from 'shared/enums/VerbsToColorMap';
import { ClobbrUIListItem } from 'models/ClobbrUIListItem';
import { GlobalStore } from 'app/globalContext';

export const ResultListItemPrimaryContent = ({
  item,
  showUrl,
  showParallelOrSequenceIcon,
  themeMode,
  suffixComponent,
  className
}: {
  item: ClobbrUIListItem;
  showUrl?: boolean;
  showParallelOrSequenceIcon?: boolean;
  themeMode: string;
  suffixComponent?: React.ReactNode;
  className?: string;
}) => {
  return (
    <GlobalStore.Consumer>
      {({ search }) => (
        <span
          className={clsx('flex items-center gap-2 truncate mb-1', className)}
        >
          {showUrl ? (
            <Tooltip title={item.url}>
              <span className="truncate">
                {item.url.replace(/^https?:\/\//, '')}
              </span>
            </Tooltip>
          ) : (
            ''
          )}

          {item.properties?.gql?.isGql ? (
            <>
              <small
                className={clsx(
                  'px-2 py-0.5',
                  'rounded-sm text-black',
                  'bg-fuchsia-300'
                )}
              >
                GQL
              </small>

              <small
                className={clsx(
                  'px-2 py-0.5',
                  'rounded-sm text-black',
                  'bg-gray-300'
                )}
              >
                {item.properties?.gql.gqlName}
              </small>
            </>
          ) : (
            <small
              className={clsx(
                'px-2 py-0.5',
                'rounded-sm text-black',
                VERB_COLOR_CLASS_MAP[item.verb] || 'bg-gray-300'
              )}
            >
              {item.verb.toUpperCase()}
            </small>
          )}

          {showParallelOrSequenceIcon ? (
            <Tooltip title={item.parallel ? 'Parallel' : 'Sequence'}>
              <div
                className="flex flex-shrink-0 items-center justify-center relative w-6 h-6 p-1 before:bg-gray-500 before:bg-opacity-10 before:flex before:w-full before:h-full before:absolute before:rounded-full"
                aria-label="Toggle between parallel / sequence"
              >
                <span
                  className={
                    themeMode === 'light' ? 'text-black' : 'text-gray-300'
                  }
                >
                  {item.parallel ? (
                    <ParallelIcon className="w-full h-full" />
                  ) : (
                    <SequenceIcon className="w-full h-full" />
                  )}
                </span>
              </div>
            </Tooltip>
          ) : (
            ''
          )}

          {suffixComponent ? suffixComponent : ''}

          {search.inProgress ? (
            <div className="flex flex-shrink-0 items-center">
              <CircularProgress size={14} />
            </div>
          ) : (
            <></>
          )}
        </span>
      )}
    </GlobalStore.Consumer>
  );
};
