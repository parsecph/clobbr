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

Save 100s of hours of work by using Page AI to generate a beautiful website. In just minutes!

| | |
| :- | :- |
| <a href="https://pageai.pro" target="_blank"><img height="60px" src="https://pageai.pro/static/images/logo-square.png" alt="Page AI Logo" /></a> <br/> <b>Page AI</b> <br/> AI Website Generator that designs and writes clean code. <br/><br/> Try the app on <a href="https://pageai.pro">pageai.pro</a>. | <a href="https://pageai.pro" target="_blank"><img width="300px" src="https://user-images.githubusercontent.com/1515742/281077548-57b24773-3c2a-4e89-b088-cc3945d7037b.png" alt="Page AI Logo" /></a> |

-----------------

Apihustle is a collection of tools to test, improve and get to know your API inside and out. <br/>
[apihustle.com](https://apihustle.com) <br/>

|                                                                                                                                                                                        |              |                                                          |                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :------------------------------------------------------- | :------------------------------------------- |
| <a href="https://pageai.pro" target="_blank"><img  width="54px" src="https://github.com/user-attachments/assets/9bfbfe6f-add9-45de-aaf2-5c6043a47e41" alt="Page AI Logo" /></a>        | **Page AI**  | AI Website Generator that designs and writes clean code. | [pageai.pro](https://pageai.pro)             |
| <a href="https://shipixen.com" target="_blank"><img  width="54px" src="https://github.com/user-attachments/assets/e1deba72-328e-4d3c-9c62-11ab77184561" alt="Shipixen Logo" /></a>     | **Shipixen** | Create a personalized blog & landing page in minutes     | [shipixen.com](https://shipixen.com)         |
| <a href="https://pageui.dev" target="_blank"><img  width="54px" src="https://github.com/user-attachments/assets/b8815b62-598a-4fca-bc27-c03e66c8b105" alt="Page UI Logo" /></a>        | **Page UI**  | Landing page UI components for React & Next.js           | [pageui.dev](https://pageui.dev)             |
| <a href="https://clobbr.app" target="_blank"><img  width="54px" src="https://github.com/user-attachments/assets/cb3e64e2-efaa-436b-ae6d-0ea4b47e4004" alt="Clobbr Logo" /></a>         | **Clobbr**   | Load test your API endpoints.                            | [clobbr.app](https://clobbr.app)             |
| <a href="https://crontap.com" target="_blank"><img  width="54px" src="https://github.com/user-attachments/assets/38a3d734-d1ca-4f92-9cfb-ada52b9f2ffb" alt="Crontap Logo" /></a>       | **Crontap**  | Schedule API calls using cron syntax.                    | [crontap.com](https://crontap.com)           |
| <a href="https://tool.crontap.com" target="_blank"><img  width="54px" src="https://github.com/user-attachments/assets/545f7618-ff2c-47fa-ad17-e17e38155f55" alt="CronTool Logo" /></a> | **CronTool** | Debug multiple cron expressions on a calendar.           | [tool.crontap.com](https://tool.crontap.com) |

-----------------

<a href="https://apihustle.com" target="_blank">
  <img height="60px" src="https://user-images.githubusercontent.com/1515742/215217833-c07183d2-f688-4d1c-86ea-329f3b28f81c.svg" alt="Apihustle Logo" />
</a>

-----------------

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)


