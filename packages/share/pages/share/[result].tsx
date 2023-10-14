import { NextPageContext } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { config } from '@/theme/config.js';
import { fromEmojiUriComponent } from '@/ui/shared/util/emojiUriComponent';
import { ClobbrUIListItem } from '@/ui/models/ClobbrUIListItem';
import { ResultChart } from '@/ui/results/ResultChart/ResultChart';
import { ResultStats } from '@/ui/results/ResultStats/ResultStats';
import { ResultListItemPrimaryContent } from '@/ui/results/Result/ResultListItemPrimaryContent/ResultListItemPrimaryContent';
import { useResultProperties } from '@/ui/results/Result/useResultProperties';

import { parseResult } from '@/components/parseResults';
import { Topbar } from '@/components/topbar/topbar';
import { BasicFooter } from '@/components/footer/basicFooter';
import { decodeShareData } from '@/components/decodeShareData';
import { getLogStats } from '@/ui/shared/util/getLogStats';

const url = `https://${config.domain}`;
const ogImageUrl = `${url}/api/ogImg`;

const Result = ({ ogData }: { ogData?: string }) => {
  const router = useRouter();
  const { result } = router.query;
  const [item, setItem] = useState<ClobbrUIListItem | undefined>(undefined);

  const { failedItems, pctOfSuccess } = useResultProperties({ item });

  const formattedDate = useMemo(() => {
    if (!item) {
      return '...';
    }

    const date = formatDistanceToNow(
      new Date(item.latestResult.startDate as string),
      {
        includeSeconds: true
      }
    );

    return date;
  }, [item]);

  useEffect(() => {
    const decompress = async () => {
      if (!result) {
        return;
      }

      const resultStr = fromEmojiUriComponent(result as string);
      const decoded = await decodeShareData(resultStr);
      const parsed = parseResult(decoded);

      if (parsed.success && parsed.item) {
        setItem(parsed.item);
      }
    };

    decompress();
  }, [result]);

  const ogTitle = 'Api speed test results';
  const ogDescription =
    'See shared results of an api speed test done from the Clobbr App.';

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} key="description" />

        <meta property="og:type" content="website" key="ogType" />
        <meta property="og:title" content={ogTitle} key="ogTitle" />
        <meta property="og:description" content={ogDescription} key="ogDesc" />

        <meta
          property="og:image"
          content={`${ogImageUrl}?${ogData}`}
          key="ogImage"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitterCard"
        />
        <meta
          property="twitter:domain"
          content={config.domain}
          key="twitterDomain"
        />
        <meta property="twitter:url" content={url} key="twitterUrl" />
        <meta name="twitter:title" content={ogTitle} key="twitterTitle" />
        <meta
          name="twitter:description"
          content={ogDescription}
          key="twitterDesc"
        />
        <meta
          name="twitter:image"
          content={`${ogImageUrl}?${ogData}`}
          key="twitterImg"
        />
      </Head>

      <div className="flex flex-col justify-center h-full min-h-screen">
        <Topbar className="fixed top-0" />

        {item ? (
          <>
            <div className="w-full p-6 mt-8 flex justify-center">
              <div className="w-full max-w-xl">
                <ResultListItemPrimaryContent
                  className="w-full inline-flex justify-center"
                  item={item}
                  showUrl={true}
                  themeMode={'dark'}
                  isInProgress={false}
                  suffixComponent={
                    <Tooltip title={item.parallel ? 'Parallel' : 'Sequence'}>
                      <div
                        className="flex flex-shrink-0 items-center justify-center relative w-6 h-6 p-1 before:bg-gray-500 before:bg-opacity-10 before:flex before:w-full before:h-full before:absolute before:rounded-full"
                        aria-label="Toggle between parallel / sequence"
                      >
                        <span className="dark:invert">
                          {item.parallel ? (
                            <Image
                              alt="Parallel"
                              src="/img/icons/Parallel.svg"
                              className="w-full h-full"
                              width={20}
                              height={20}
                            />
                          ) : (
                            <Image
                              alt="Sequence"
                              src="/img/icons/Sequence.svg"
                              className="w-full h-full"
                              width={20}
                              height={20}
                            />
                          )}
                        </span>
                      </div>
                    </Tooltip>
                  }
                />

                <Typography
                  variant="caption"
                  className="flex items-center gap-1 justify-center opacity-50 py-1 w-full"
                >
                  <strong>{item.iterations}</strong> iterations sent in
                  <strong>{item.parallel ? 'parallel' : 'sequence'}</strong> ran
                  <strong>{formattedDate} ago</strong>
                </Typography>
              </div>
            </div>

            <ResultChart
              chartDownSampleThreshold={1000}
              item={item}
              className="mt-4"
            />

            <div className="mb-12">
              <div>
                <ResultStats
                  result={item.latestResult}
                  otherStats={[
                    {
                      label: 'Pct. of success',
                      value: `${pctOfSuccess}%`,
                      colorClass: ''
                    }
                  ]}
                />
              </div>

              {failedItems.length > 0 ? (
                <div className="flex flex-col items-center mt-4">
                  <Alert severity="error">
                    {failedItems.length} failed. Showing results only for
                    successful requests ({pctOfSuccess}% succeded).
                  </Alert>
                </div>
              ) : (
                ''
              )}
            </div>
          </>
        ) : (
          <></>
        )}

        <BasicFooter />
      </div>
    </>
  );
};

export async function getServerSideProps(context: {
  params: { result: string };
}) {
  try {
    const sharedData = context.params.result;
    const sharedDataStr = fromEmojiUriComponent(sharedData as string);

    const brotli = await import('brotli-wasm');
    const decompressedData = brotli.decompress(
      Buffer.from(sharedDataStr, 'base64')
    );
    const decompressedText = Buffer.from(decompressedData).toString('utf8');
    const parsed = parseResult(decompressedText);

    const gql = parsed.item?.properties?.gql;
    const stats = parsed.item?.latestResult.logs
      ? getLogStats(parsed.item.latestResult.logs)
      : [];

    if (!parsed.item) {
      return {
        props: {
          ogData: ''
        }
      };
    }

    const ogData = {
      url: parsed.item.url,
      verb: parsed.item.verb as string,
      durations: parsed.item.latestResult.resultDurations.join('*'),
      isGql: gql ? gql.isGql.toString() : '',
      gqlName: gql ? gql.gqlName : '',
      parallel: parsed.item.parallel.toString(),
      iterations: parsed.item.iterations.toString(),
      stats: stats
        .map(
          ({ value, label }: { value: string; label: string }) =>
            `${value}:${label}`
        )
        .join('*')
    };

    return {
      props: {
        ogData: new URLSearchParams(ogData).toString()
      }
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        ogData: ''
      }
    };
  }
}

export default Result;
