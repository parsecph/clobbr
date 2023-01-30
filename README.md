<p align="center">
  <img witdh="150px" height="150px" alt="clobbr grid logo" src="https://user-images.githubusercontent.com/1515742/80861783-dcfcc400-8c70-11ea-89c6-671dbdff6f33.png" /> <br/><br/>

  <img witdh="20px" height="20px" alt="clobbr typeface logo" src="https://user-images.githubusercontent.com/1515742/80861788-de2df100-8c70-11ea-8a56-155eef6691e8.png" />
</p>

<div align="center">
  <a href="https://apps.apple.com/us/app/clobbr-test-endpoint-speed/id1629096010?mt=12" target="_blank">
    <img height="40px" src="https://user-images.githubusercontent.com/1515742/189620547-646b3682-708a-4378-9e40-b6ca8e67a077.svg" alt="Download Clobbr on the Apple App Store" />
  </a>

  <a href="https://apps.microsoft.com/store/detail/clobbr-api-speed-test/9P7CVP0HG5V9?hl=en-us&gl=us" target="_blank">
    <img height="40px" src="https://user-images.githubusercontent.com/1515742/189620555-7bef1a55-f8a5-4d4b-8879-237e29b1dd04.svg" alt="Download Clobbr on the Microsoft Store" />
  </a>

  <a href="https://www.npmjs.com/package/@clobbr/cli" target="_blank">
    <img height="40px" src="https://user-images.githubusercontent.com/1515742/189622786-30f2b136-1877-48a6-817d-49c9d0a97367.svg" alt="Download Clobbr on the Microsoft Store" />
  </a>
</div>

# Clobbr - test your api's response times

Test your api endpoints to see how well they perform under multiple requests (clobber your apis!), in sequence or parallel.

[![@clobbr/cli version](https://img.shields.io/npm/v/@clobbr/cli?label=cli&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/cli) [![@clobbr/api version](https://img.shields.io/npm/v/@clobbr/api?label=api&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/api) [![Tests](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml/badge.svg)](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml)


| <img width="620px" src="https://user-images.githubusercontent.com/1515742/198825002-b4633117-d6a0-4025-821d-fb6605c209a2.gif" alt="Clobbr api endpoint performance and speed test Application demo" /> | <img width="600px" src="https://user-images.githubusercontent.com/1515742/113618284-be106a00-9657-11eb-9709-04b911e7ccd5.gif" alt="Clobbr api endpoint performance and speed test demo" /> |
|-|-|



## Quick start

### Application
Download on [the Mac App Store](https://apps.apple.com/us/app/clobbr-test-endpoint-speed/id1629096010?mt=12) or [the Microsoft Store](https://apps.microsoft.com/store/detail/clobbr-api-speed-test/9P7CVP0HG5V9?hl=en-us&gl=us) and start testing your api endpoints.

### Command Line (cli)

```bash
npx @clobbr/cli run --url "https://api.github.com/zen"
```

Run `npx @clobbr/cli` to see all options or
head over to [@clobbr/cli docs](./packages/cli/README.md).

> Binaries are also available for your favorite OS [here ⬇️ 💿](https://github.com/parsecph/clobbr/releases).

#### CI
The cli can be used in a CI context too.
[See examples with popular CIs here ↗️](https://github.com/parsecph/clobbr-ci)

<a href="https://app.circleci.com/pipelines/github/parsecph/clobbr-ci/471/workflows/706bab66-3ced-4a60-aca1-f832e1d1e85a/jobs/470/parallel-runs/0/steps/0-102">
  <img width="200px" alt="CircleCI integration config" src="https://user-images.githubusercontent.com/1515742/189537171-4a064b0d-3db9-4016-9baf-f6b6ac49f45d.png">
</a>

<a href="https://app.travis-ci.com/github/parsecph/clobbr-ci">
  <img width="200px" alt="Travis CI integration config" src="https://user-images.githubusercontent.com/1515742/189537172-c4e01aaf-16f2-499f-92d5-924c82a44540.png">
</a>

<a href="https://ci.appveyor.com/project/dandaniel/clobbr-ci">
  <img width="200px" alt="AppVeyor CI integration config" src="https://user-images.githubusercontent.com/1515742/189537169-1b6b812a-9830-4573-955d-b25ccec27e08.png">
</a>

## What the cli can do

This package can stress-test your API endpoints in various ways so you can get a better idea on how your app would work under a (closer to) real world scenario.

Configure requests, set iterations and analyze response times of your API endpoints in a fashionable ascii chart or jaw-dropping table.

On top of that, get stats on responses such as mean, standard deviation, 5th/95th/99th percentiles and more.

With all that, output to various file formats such as csv, json, yaml and more. Use in your CI of choice or just run it locally.

### Usage examples for the cli

#### Kitchen sink example
```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --method POST \
  --iterations 50 \
  --parallel \
  --checks mean=200 median=200 stdDev=50 q5=150 q50=200 q95=250 q99=300 pctOfSuccess=95 \
  --headersPath "headers.json" \
  --dataPath "data.json" \
  --outputFile \
  --outputFormat yaml \
  --table "compact"
```

> This is an advanced run configuration example. Typically, less config is needed. Read on for more.

#### Define iterations

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 30
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619315-1d22ae80-9659-11eb-996f-daa6c68bc682.jpg" />

#### Send requests in parallel

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 30 \
  --parallel
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619313-1c8a1800-9659-11eb-84c1-af396ae305a6.jpg" />

#### Display a summary table

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 30 \
  --table "full"
```

<img width="375px" alt="clobbr show detailed api response summary table" src="https://user-images.githubusercontent.com/1515742/113619310-1b58eb00-9659-11eb-921c-46702345499e.jpg" />

#### Display a minimal summary table

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 30 \
  --table "compact"
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113619304-1a27be00-9659-11eb-92f8-1cea2e32399c.jpg" />


#### Customize Request Method
`GET` is used as the default request method, but you can pass an optional request method, such as `POST`, `PUT`, `PATCH`, `DELETE` etc.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --method OPTIONS
```

#### Send Headers
Arbitrary request headers are accepted as a JSON file.

> Tip 💡
>
> Passing { Cookie: "val" } adds a cookie to the request.

```json
# headers.json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3",
  "User-Agent": "Mozilla/5.0"
}
```

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 20 \
  --headersPath "headers.json"
```

#### Send Data
Arbitrary request data is accepted as a JSON file.

```json
# data.json
{
  "id": "17b",
  "user": {
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "visits": 50
}
```

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 20 \
  --method "POST" \
  --dataPath "data.json"
```

#### Analyze failed request iterations
By default, details on failed iterations are neatly displayed via the table option.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --iterations 20 \
  --method "POST" \
  --headersPath "headers.json" \
  --dataPath "data.json" \
  --table "compact"
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113765840-13627f00-971d-11eb-8c45-5f4f39ef7db6.jpg" />

#### Get results in different file formats
Results will be shown in a human-readable format by default, but you can also get results in JSON, YAML and CSV format.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --outputFormat json                \
  --outputFile
```

#### Run checks against results
Set target values for percentage of success (pctOfSuccess), mean (ms), median (ms), standardDeviation (stdDev in ms) and supported quantiles in ms (q5, q50, q95, q99).

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --checks mean=200 median=200 stdDev=50 q5=150 q50=200 q95=250 q99=300 pctOfSuccess=95
```

<img width="500px" alt="Run checks against results" src="https://user-images.githubusercontent.com/1515742/189538796-4d96f78f-0251-41e4-a549-bcb04eab2fb2.png">

Only include checks that you want to run. If you don't specify a check, it will not be run.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \
  --checks pctOfSuccess=90
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

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)


