## @clobbr/cli

[![@clobbr/cli on npm](https://img.shields.io/npm/v/@clobbr/cli?label=npm&style=flat)](https://www.npmjs.com/package/@clobbr/cli)

Use this cli tool to test your api endpoints to see how well they perform under multiple requests in sequence or parallel.

### Basic usage

```bash
npx @clobbr/cli run --url "https://github.com"
```

[👉 See how to get started and examples here](https://github.com/parsecph/clobbr/blob/master/README.md)


### Options

```
Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  run [options]   Test an api endpoint/url (<url>), Valid urls begin with http(s)://
  help [command]  display help for command
```

### `@clobbr/cli run`

```
Usage: clobbr run [options]

Test an api endpoint/url (<url>), Valid urls begin with http(s)://

Options:
Usage: clobbr run [options]

Test an api endpoint/url (<url>), Valid urls begin with http(s)://

Options:
  -u, --url <url>                     url to test
  -m, --method <method>               request method (verb) to use. (default: "get")
  -i, --iterations <iterations>       number of requests to perform. (default: "10")
  -h, --headersPath <headersPath>     path to headers file (json), to add as request headers.
  -d, --dataPath <dataPath>           path to data file (json), to add as request body.
  -p, --parallel                      run requests in parallel. (default: false)
  -c, --chart                         display results as a chart. (default: true)
  -t, --table <table>                 display results as a table (none, compact, full). (default: "none")
  -of, --outputFormat <outputFormat>  output format: (table, csv, yaml, json). (default: "table")
  -out, --outputFile <outputFormat>   if option set the result will be output as a file. Can optionally pass a filename to
                                      use with this option. (default: false)
  --help                              display help for command
```

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)

