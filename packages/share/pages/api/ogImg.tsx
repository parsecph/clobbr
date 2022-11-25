import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
};

export default async function OgImage(req: NextRequest) {
  try {
    // NB: hack to unescape html query string: https://github.com/facebook/react/issues/13838
    const { searchParams } = new URL(req.url.replace(/&amp%3B/g, '&'));
    const url = searchParams.get('url');
    const verb = searchParams.get('verb');
    const durations = searchParams.get('durations')?.split(',');
    const isGql =
      searchParams.get('isGql') && searchParams.get('isGql') === 'true';
    const gqlName = searchParams.get('gqlName');
    const parallel =
      searchParams.get('parallel') && searchParams.get('parallel') === 'true';
    const iterations = searchParams.get('iterations');
    const stats = searchParams
      .get('stats')
      ?.split(',')
      .map((stat) => {
        const [value, label] = stat.split(':');
        return { value, label };
      });

    console.log({
      url,
      verb,
      durations,
      isGql,
      parallel,
      iterations,
      stats
    });

    const canvasWidth = 1200;
    const canvasHeight = 630;
    const svgWidth = 1200;
    const svgHeight = canvasHeight - 350;

    const durationNumber = durations?.map((d) => parseInt(d, 10)) || [];

    const indexMultiplier = svgWidth / (durationNumber.length - 1);
    const svgViewBox = `0 0 ${svgWidth} ${svgHeight}`;

    const maxDuration = Math.max(...durationNumber);

    const svgPath = durationNumber.map((d, index) => {
      const command = index === 0 ? 'M' : 'L';
      const x = index * indexMultiplier;
      const y = svgHeight - (d * svgHeight) / maxDuration;

      return `${command} ${x},${y}`;
    });

    const svgChart = `${svgPath.join(' ')} l 5,${svgHeight + 5} L -5,${
      svgHeight + 5
    } Z`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white'
          }}
        >
          <div tw="flex items-center justify-center absolute top-0 left-0 w-full h-full">
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={svgViewBox}
              xmlns="http://www.w3.org/2000/svg"
              fill="transparent"
            >
              <linearGradient id="lgrad" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop
                  offset="0%"
                  stopColor="rgb(255,255,255)"
                  stopOpacity="0.00"
                />
                <stop
                  offset="30%"
                  stopColor="rgb(255,255,255)"
                  stopOpacity="0.00"
                />
                <stop
                  offset="90%"
                  stopColor="rgb(158,255,200)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="99%"
                  stopColor="rgb(158,255,200)"
                  stopOpacity="1"
                />
              </linearGradient>

              <path
                d={svgChart}
                stroke="#5FB280"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="url(#lgrad)"
              />
            </svg>
          </div>

          <div tw="bg-gray-50/95 flex relative z-10">
            <div tw="flex flex-row w-full py-4 px-8 items-center justify-between">
              <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-gray-900 text-left">
                {url ? (
                  <span>
                    {url.length > 50 ? url.slice(0, 50) + '...' : url}
                  </span>
                ) : (
                  ''
                )}
                <span tw="flex text-3xl text-green-400 mt-1">
                  <u tw="mr-1">{iterations}</u>
                  <span tw="mr-1">iterations sent in</span>
                  <u tw="mr-1">{parallel ? 'parallel' : 'sequence'}</u>
                </span>
              </h2>
              <div tw="flex mt-0">
                <div tw="flex rounded-md shadow">
                  <a
                    href="#"
                    tw={`flex items-center justify-center rounded-md border border-transparent px-8 py-4 text-3xl font-medium text-white uppercase ${
                      isGql ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                  >
                    {isGql ? 'GQL' : verb}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div tw="flex w-full justify-center p-3 bg-white/95 mt-auto">
            {stats
              ? stats.map(({ label, value }, index) => (
                  <div
                    key={index}
                    tw={`flex flex-col items-center border-l border-gray-500 border-opacity-20 p-5 text-2xl ${
                      index === 0 ? 'border-0' : 'border-l'
                    }`}
                  >
                    <p tw="m-0 p-0">{value} ms</p>
                    <p tw="m-0 p-0 opacity-50">{label}</p>
                  </div>
                ))
              : ''}
          </div>
        </div>
      ),
      {
        width: canvasWidth,
        height: canvasHeight
      }
    );
  } catch (error) {
    console.error(error);

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Clobbr result
        </div>
      ),
      {
        width: 1200,
        height: 600
      }
    );
  }
}
