<p align="center">
  <img witdh="150px" height="150px" alt="clobbr grid logo" src="https://user-images.githubusercontent.com/1515742/80861783-dcfcc400-8c70-11ea-89c6-671dbdff6f33.png" />

  <h3 align="center">
    Clobbr - API speed test <br/>
    <small><a href="https://clobbr.app">clobbr.app</a></small> <br/>
    <a href="https://www.npmjs.com/package/@clobbr/cli" target="_blank">
      <img src="https://img.shields.io/npm/v/@clobbr/cli?label=npm&style=flat" alt="get @clobbr/cli on npm">
    </a>
  </h3>
</p>

## @clobbr/cli

Test your api endpoints to see how well they perform under multiple requests (clobber your apis!), in sequence or parallel.

[👉 See cli usage examples here ↗️](https://github.com/parsecph/clobbr/blob/master/README.md#usage-examples-for-the-cli)


Use this cli tool from your favorite shell or integrate with your CI server:

<a href="https://app.circleci.com/pipelines/github/parsecph/clobbr-ci?branch=main">
  <img width="200px" alt="CircleCI integration config" src="https://user-images.githubusercontent.com/1515742/189537171-4a064b0d-3db9-4016-9baf-f6b6ac49f45d.png">
</a>

<a href="https://app.travis-ci.com/github/parsecph/clobbr-ci">
  <img width="200px" alt="Travis CI integration config" src="https://user-images.githubusercontent.com/1515742/189537172-c4e01aaf-16f2-499f-92d5-924c82a44540.png">
</a>

<a href="https://ci.appveyor.com/project/dandaniel/clobbr-ci">
  <img width="200px" alt="AppVeyor CI integration config" src="https://user-images.githubusercontent.com/1515742/189537169-1b6b812a-9830-4573-955d-b25ccec27e08.png">
</a>

[See more ci samples ↗️](https://github.com/parsecph/clobbr-ci)

### Basic usage

```bash
npx @clobbr/cli run --url "https://github.com"
```

[See more examples here ↗️](https://github.com/parsecph/clobbr/blob/master/README.md#usage-examples-for-the-cli)


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
  -u, --url <url>                     url to test
  -m, --method <method>               request method (verb) to use. (default: "get")
  -i, --iterations <iterations>       number of requests to perform. (default: "10")
  -h, --headersPath <headersPath>     path to headers file (json), to add as request headers.
  -d, --dataPath <dataPath>           path to data file (json), to add as request body.
  -p, --parallel                      run requests in parallel. (default: false)
  -c, --chart                         display results as a chart. (default: true)
  -t, --table <table>                 type of table to display for the visual output format: (none, compact, full).
                                      (default: "none")
  -of, --outputFormat <outputFormat>  output format: (visual, csv, yaml, json). (default: "visual")
  -out, --outputFile <outputFile>     if option set the result will be output as a file. Can optionally pass a filename to
                                      use with this option. Outputs as json if no output format is specified. (default:
                                      false)
  -ck, --checks <checks...>           checks to be made on the results. Can have multiple values. Available checks: mean
                                      (max ms), median (max ms), stdDev (max ms), q5 (max ms), q50 (max ms), q95 (max ms),
                                      q99 (max ms), pctOfSuccess (0-100). (default: false)
  --help                              display help for command
```

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)

