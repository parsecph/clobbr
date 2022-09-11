import asciichart from 'asciichart';

export const renderChart = (results: Array<number>) => {
  if (results.length) {
    // TODO autoresize?
    console.log('\n');
    console.log(
      asciichart.plot(results, {
        offset: 2,
        height: 10,
        width: 15,
        colors: [asciichart.green, asciichart.blue]
      })
    );
    console.log('\n');
  }
};
