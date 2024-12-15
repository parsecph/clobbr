import { ClobbrUIListItem } from '@/ui/models/ClobbrUIListItem';
import { ClobbrUICompressedResultListItem } from '@/ui/models/ClobbrCompressedResultListItem';
import { ClobbrUIResult } from '@/ui/models/ClobbrUIResult';

export const parseResult = (
  result: string
): {
  success: boolean;
  item?: ClobbrUIListItem;
} => {
  try {
    const parsed: ClobbrUICompressedResultListItem = JSON.parse(result);

    const statusMap = parsed.stM;
    const statusCodeMap = parsed.scM;
    const sizeMap = parsed.szM;

    let reversedStatusMap: { [key: string]: string } = {};
    let reversedStatusCodeMap: { [key: string]: number } = {};
    let reversedSizeMap: { [key: string]: string } = {};

    for (const key in statusMap) {
      reversedStatusMap[statusMap[key]] = key;
    }

    for (const key in statusCodeMap) {
      reversedStatusCodeMap[statusCodeMap[key]] = parseInt(key, 10);
    }

    for (const key in sizeMap) {
      reversedSizeMap[sizeMap[key]] = key;
    }

    const logs = parsed.lr.l.map((log: Array<number | string>) => {
      const [
        duration,
        unmappedSize,
        unmappedStatus,
        unmappedStatusCode,
        failed
      ] = log;

      return {
        url: parsed.u,
        verb: parsed.v as any,
        metas: {
          status: reversedStatusMap[unmappedStatus],
          statusCode: reversedStatusCodeMap[unmappedStatusCode],
          duration: duration as number,
          size: reversedSizeMap[unmappedSize],

          // Unknow
          durationUnit: 'ms', // NB: assume ms
          index: 0
        },
        failed: !!failed,
        error: failed
          ? parsed.ig
            ? 'GQL inner error'
            : 'HTTP error'
          : undefined,

        // Unkown
        headers: {},
        formatted: ''
      };
    });

    const resultDurations = parsed.lr.l
      .map((log: Array<number | string>) => {
        const [duration] = log;
        return duration as number;
      })
      .flat();

    const item: ClobbrUIListItem = {
      ssl: parsed.s,
      parallel: parsed.lr.p,
      iterations: parsed.lr.i,
      verb: parsed.v as any,
      url: parsed.u,
      startDate: parsed.lr.s,
      endDate: parsed.lr.e,
      logs,
      resultDurations,
      historicalResults: [],
      properties: {
        gql: {
          isGql: parsed.ig || false,
          gqlName: parsed?.gql || '',

          // Unknown
          gqlVariables: {}
        }
      },

      // Unkown
      cacheId: '',
      listItemId: '',
      timeout: 0,
      headers: [],
      data: {}
    };

    return {
      item,
      success: true
    };
  } catch (error) {
    console.error(error);
    return {
      success: false
    };
  }
};
