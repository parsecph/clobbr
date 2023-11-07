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

<a href="https://app.circleci.com/pipelines/github/parsecph/clobbr-ci/471/workflows/706bab66-3ced-4a60-aca1-f832e1d1e85a/jobs/470/parallel-runs/0/steps/0-102">
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
  -dbg, --debug                       output debug logs with full request/response data & config.
  --help                              display help for command
```

-----------------

<a href="https://apihustle.com" target="_blank">
  <img height="60px" src="https://user-images.githubusercontent.com/1515742/215217833-c07183d2-f688-4d1c-86ea-329f3b28f81c.svg" alt="Apihustle Logo" />
</a>

This tool is part of the Apihustle suite - a collection of tools to test, improve and get to know your API inside and out. <br/>
[apihustle.com](https://apihustle.com) <br/>

|    |    |    |    |
| :- | :- | :- | :- |
| <a href="https://clobbr.app" target="_blank"><img height="70px" src="https://user-images.githubusercontent.com/1515742/215217949-0fe7096c-10f1-47ec-bdc7-91d8047ddc70.svg" alt="Clobbr Logo" /></a> | **Clobbr** | Debug multiple cron expressions on a calendar. | [clobbr.app](https://clobbr.app) |
| <a href="https://crontap.com" target="_blank"><img height="70px" src="https://user-images.githubusercontent.com/1515742/215218037-44233c7d-7e21-4180-8572-6a759a6a118f.svg" alt="Crontap Logo" /></a> | **Crontap** | Schedule API calls using cron syntax. | [crontap.com](https://crontap.com) |
| <a href="https://tool.crontap.com" target="_blank"><img height="70px" src="https://user-images.githubusercontent.com/1515742/215217997-fedcc496-a868-40bd-81f9-d07dabc0597e.svg" alt="CronTool Logo" /></a> | **CronTool** | Debug multiple cron expressions on a calendar. | [tool.crontap.com](https://tool.crontap.com)  |

-----------------

Save 10s of hours of work by using Shipixen to generate a customized boilerplate with your branding, pages and blog <br/>
― then deploy it to Vercel with 1 click.

| | |
| :- | :- |
| <a href="https://shipixen.com" target="_blank"><img height="60px" src="https://user-images.githubusercontent.com/1515742/281071510-d5c0095d-d336-4857-ad80-d18cf65f4acb.png" alt="Shipixen Logo" /></a> <br/> <b>Shipixen</b> <br/> Create a blog & landing page in minutes with <b>Shipixen</b>. <br/> Get started on <a href="https://shipixen.com">shipixen.com</a>. | <a href="https://shipixen.com" target="_blank"><img width="300px" src="https://user-images.githubusercontent.com/1515742/281077548-57b24773-3c2a-4e89-b088-cc3945d7037b.png" alt="Shipixen Logo" /></a> |
 
-----------------

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)


