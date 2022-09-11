<p align="center">
  <img witdh="150px" height="150px" alt="clobbr grid logo" src="https://user-images.githubusercontent.com/1515742/80861783-dcfcc400-8c70-11ea-89c6-671dbdff6f33.png" /> <br/><br/>

  <img witdh="20px" height="20px" alt="clobbr typeface logo" src="https://user-images.githubusercontent.com/1515742/80861788-de2df100-8c70-11ea-8a56-155eef6691e8.png" />
</p>

# Clobbr - test your api's response times

Test your api endpoints to see how well they perform under multiple requests (clobber your apis!), in sequence or parallel.

[![@clobbr/cli version](https://img.shields.io/npm/v/@clobbr/cli?label=cli&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/cli) [![@clobbr/api version](https://img.shields.io/npm/v/@clobbr/api?label=api&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/api) [![Tests](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml/badge.svg)](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml)

![Clobbr api endpoint performance and speed test demo](https://user-images.githubusercontent.com/1515742/113618284-be106a00-9657-11eb-9709-04b911e7ccd5.gif)

## Quick start

```bash
npx @clobbr/cli run --url "https://api.github.com/zen"
```

Run `npx @clobbr/cli` to see all options or
head over to [@clobbr/cli docs](./packages/cli/README.md).

> Not a fan of npx? Get binaries for your favorite OS [here ⬇️ 💿](https://github.com/parsecph/clobbr/releases).
>
> Available for linux, macos and windows.

## What the cli can do

This package can stress-test your API endpoints in various ways so you can get a better idea on how your app would work under a (closer to) real world scenario.

Configure requests, set iterations and analyze response times of your API endpoints in a fashionable ascii chart or jaw-dropping table.

On top of that, get stats on responses such as mean, standard deviation, 5th/95th/99th percentiles and more.

With all that, output to various file formats such as csv, json, yaml and more. Use in your CI of choice or just run it locally.

### CI usage examples

<a href="https://github.com/parsecph/clobbr-ci/blob/main/.circleci/config.yml">
  <img width="200px" alt="CircleCI integration config" src="https://user-images.githubusercontent.com/1515742/189537171-4a064b0d-3db9-4016-9baf-f6b6ac49f45d.png">
</a>

<a href="https://github.com/parsecph/clobbr-ci/blob/main/.travis.yml">
  <img width="200px" alt="Travis CI integration config" src="https://user-images.githubusercontent.com/1515742/189537172-c4e01aaf-16f2-499f-92d5-924c82a44540.png">
</a>

<a href="https://github.com/parsecph/clobbr-ci/blob/main/appveyor.yml">
  <img width="200px" alt="AppVeyor CI integration config" src="https://user-images.githubusercontent.com/1515742/189537169-1b6b812a-9830-4573-955d-b25ccec27e08.png">
</a>

[See more here ↗️](https://github.com/parsecph/clobbr-ci)

### Basic examples

#### Define iterations

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \     # or `-u <url>`
  --iterations 30                          # or `-i 30`
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619315-1d22ae80-9659-11eb-996f-daa6c68bc682.jpg" />

#### Send requests in parallel

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \    # or `-u <url>`
  --iterations 30 \                       # or `-i 30`
  --parallel                              # or `-p`
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619313-1c8a1800-9659-11eb-84c1-af396ae305a6.jpg" />

#### Display a summary table

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \    # or `-u <url>`
  --iterations 30 \                       # or `-i 30`
  --table "full"                          # or `-t "full"`
```

<img width="375px" alt="clobbr show detailed api response summary table" src="https://user-images.githubusercontent.com/1515742/113619310-1b58eb00-9659-11eb-921c-46702345499e.jpg" />

#### Display a minimal summary table

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \    # or `-u <url>`
  --iterations 30 \                       # or `-i 30`
  --table "compact"                       # or `-t "compact"`
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113619304-1a27be00-9659-11eb-92f8-1cea2e32399c.jpg" />


#### Customize Request Method
`GET` is used as the default request method, but you can pass an optional request method, such as `POST`, `PUT`, `PATCH`, `DELETE` etc.

#### Send Headers
Arbitrary request headers are accepted as a JSON file.

> Tip 💡
>
> Passing { Cookie: "val" } adds a cookie to the request.

```json
// headers.json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3",
  "User-Agent": "Mozilla/5.0"
}
```

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \    # or `-u <url>`
  --iterations 20 \                       # or `-i 30`
  --headerPath "headers.json"             # or `-h "headers.json"
```

#### Send Data
Arbitrary request data is accepted as a JSON file.

```json
// data.json
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
  --url "https://api.github.com/zen" \    # or `-u <url>`
  --iterations 20 \                       # or `-i 30`
  --method "POST" \                       # or `-m "POST"`
  --dataPath "data.json"                  # or `-d "data.json"
```

#### Analyze failed request iterations
By default, details on failed iterations are neatly displayed via the table option.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen" \    # or `-u <url>`
  --iterations 20 \                       # or `-i 30`
  --method "POST" \                       # or `-m "POST"`
  --headerPath "headers.json" \           # or `-h "headers.json"
  --dataPath "data.json" \                # or `-d "data.json"
  --table "compact"                       # or `-t "compact`
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113765840-13627f00-971d-11eb-8c45-5f4f39ef7db6.jpg" />

#### Get results in different file formats
Results will be shown in a human-readable format by default, but you can also get results in JSON, YAML and CSV format.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen"
  --outputFormat json                 # supported: json, csv, yaml
  --outputFile                        # optionally, pass a file name
```

#### Run checks against results
Set target values for percentage of success (pctOfSuccess), mean (average), median, standardDeviation (stdDev) and supported quantiles (q5, q50, q95, q99).

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen"
  --checks mean=200 median=200 stdDev=200 q5=200 q50=200 q95=200 q99=200 pctOfSuccess=95
```

<img width="500px" alt="Run checks against results" src="https://user-images.githubusercontent.com/1515742/189538796-4d96f78f-0251-41e4-a549-bcb04eab2fb2.png">

Only include checks that you want to run. If you don't specify a check, it will not be run.

```bash
npx @clobbr/cli run \
  --url "https://api.github.com/zen"
  --checks pctOfSuccess=90
```

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)
