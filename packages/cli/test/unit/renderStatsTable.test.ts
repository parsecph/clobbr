import test from 'ava';
import { renderStatsTable } from '../../src/output/table';
import { ClobbrLogItem } from '@clobbr/api/src/models/ClobbrLog';
import { ETableTypes, TABLE_TYPES } from '../../src/enums/table';

const sampleData = [
  {
    metas: {
      duration: 189
    }
  },
  {
    metas: {
      duration: 197
    }
  },
  {
    metas: {
      duration: 1200
    }
  },
  {
    metas: {
      duration: 3600
    }
  },
  {
    metas: {
      duration: 5200
    }
  },
  {
    metas: {
      duration: 15000
    }
  },
  {
    metas: {
      duration: 20000
    }
  },
  {
    metas: {
      duration: 30000
    }
  },
  {
    metas: {
      duration: 40000
    }
  }
];

test('stats table => should succeed with no stats', (t) => {
  const result = renderStatsTable([], []);

  t.deepEqual(result, [
    [
      'Average (Mean)',
      'Standard Deviation',
      '5th percentile',
      '95th percentile',
      '99th percentile'
    ],
    ['0 ms', '-', '0 ms', '0 ms', '0 ms']
  ]);
});

test('stats table => should succeed with 1 stat', (t) => {
  const result = renderStatsTable([], [
    {
      metas: {
        duration: 5000
      }
    }
  ] as Array<ClobbrLogItem>);

  t.deepEqual(result, [
    [
      'Average (Mean)',
      'Standard Deviation',
      '5th percentile',
      '95th percentile',
      '99th percentile'
    ],
    ['5,000 ms', '-', '5,000 ms', '5,000 ms', '5,000 ms']
  ]);
});

test('stats table => should succeed with sample stats', (t) => {
  const result = renderStatsTable([], sampleData as Array<ClobbrLogItem>);

  t.deepEqual(result, [
    [
      'Average (Mean)',
      'Standard Deviation',
      '5th percentile',
      '95th percentile',
      '99th percentile'
    ],
    ['12,820.67 ms', '14,522.35 ms', '5,200 ms', '36,000 ms', '39,200 ms']
  ]);
});

test('stats table => should succeed with sample stats and failed requests', (t) => {
  const result = renderStatsTable(
    [
      {
        metas: {
          duration: 5000
        }
      }
    ] as Array<ClobbrLogItem>,
    sampleData as Array<ClobbrLogItem>
  );

  t.deepEqual(result, [
    [
      'Average (Mean)',
      'Standard Deviation',
      '5th percentile',
      '95th percentile',
      '99th percentile'
    ],
    ['12,820.67 ms', '14,522.35 ms', '5,200 ms', '36,000 ms', '39,200 ms']
  ]);
});

test('stats table => should succeed with startDuration and endDuration', (t) => {
  const result = renderStatsTable(
    [],
    sampleData as Array<ClobbrLogItem>,
    TABLE_TYPES.compact as ETableTypes,
    1719513331987,
    1719513334275
  );

  t.deepEqual(result, [
    [
      'Average (Mean)',
      'Standard Deviation',
      '5th percentile',
      '95th percentile',
      '99th percentile',
      'Total time'
    ],
    [
      '12,820.67 ms',
      '14,522.35 ms',
      '5,200 ms',
      '36,000 ms',
      '39,200 ms',
      '2,288 ms'
    ]
  ]);
});
