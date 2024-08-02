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


Use this cli tool from your favorite shell or integrate with your CI/CD server.
[See CI/CD examples here ↗️](https://github.com/parsecph/clobbr-ci-examples)

### Basic usage

```bash
npx @clobbr/cli run --url "https://github.com"
```

[See more usage examples here ↗️](https://github.com/parsecph/clobbr/blob/master/README.md#usage-examples-for-the-cli)

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

-----------------

Save 10s of hours of work by using Shipixen to generate a customized codebases with your branding, pages and blog <br/>
― then deploy it to Vercel with 1 click.

| | |
| :- | :- |
| <a href="https://shipixen.com" target="_blank"><img height="60px" src="https://user-images.githubusercontent.com/1515742/281071510-d5c0095d-d336-4857-ad80-d18cf65f4acb.png" alt="Shipixen Logo" /></a> <br/> <b>Shipixen</b> <br/> Create a blog & landing page in minutes with <b>Shipixen</b>. <br/> Try the app on <a href="https://shipixen.com">shipixen.com</a>. | <a href="https://shipixen.com" target="_blank"><img width="300px" src="https://user-images.githubusercontent.com/1515742/281077548-57b24773-3c2a-4e89-b088-cc3945d7037b.png" alt="Shipixen Logo" /></a> |

-----------------

Apihustle is a collection of tools to test, improve and get to know your API inside and out. <br/>
[apihustle.com](https://apihustle.com) <br/>

|    |    |    |    |
| :- | :- | :- | :- |
| <a href="https://shipixen.com" target="_blank"><img height="70px" src="https://github.com/apihustle/apihustle/assets/1515742/3af97560-d774-4149-96c5-65d3cc530a5a" alt="Shipixen Logo" /></a> | **Shipixen** | Create a personalized blog & landing page in minutes | [shipixen.com](https://shipixen.com) | 
| <a href="https://pageui.dev" target="_blank"><img height="70px" src="https://github.com/apihustle/apihustle/assets/1515742/953cc5ab-bbf4-4a19-9b16-c74d218b63b4" alt="Page UI Logo" /></a> | **Page UI** | Landing page UI components for React & Next.js | [pageui.dev](https://pageui.dev) | 
| <a href="https://clobbr.app" target="_blank"><img height="70px" src="https://github.com/apihustle/apihustle/assets/1515742/50c11d46-a025-40fd-b154-0a5984556f6e" alt="Clobbr Logo" /></a> | **Clobbr** | Load test your API endpoints. | [clobbr.app](https://clobbr.app) | 
| <a href="https://crontap.com" target="_blank"><img height="70px" src="https://github.com/apihustle/apihustle/assets/1515742/fe1aac71-b663-4f8e-a225-0c47b2eee14d" alt="Crontap Logo" /></a> | **Crontap** | Schedule API calls using cron syntax. | [crontap.com](https://crontap.com) | 
| <a href="https://tool.crontap.com" target="_blank"><img height="70px" src="https://github.com/apihustle/apihustle/assets/1515742/713ff923-b03c-43ec-9cfd-75e542d0f5c4" alt="CronTool Logo" /></a> | **CronTool** | Debug multiple cron expressions on a calendar. | [tool.crontap.com](https://tool.crontap.com)  |


-----------------

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)


