<p align="center">
  <img witdh="150px" height="150px" alt="clobbr grid logo" src="https://user-images.githubusercontent.com/1515742/80861783-dcfcc400-8c70-11ea-89c6-671dbdff6f33.png" /> <br/><br/>

  <img witdh="20px" height="20px" alt="clobbr typeface logo" src="https://user-images.githubusercontent.com/1515742/80861788-de2df100-8c70-11ea-8a56-155eef6691e8.png" />
</p>

# Clobbr - test your api's response times

Test your api endpoints to see how well they perform under multiple requests (clobber your apis!), in sequence or parallel.

[![npm (scoped)](https://img.shields.io/npm/v/@clobbr/cli?label=cli&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/cli) [![npm (scoped)](https://img.shields.io/npm/v/@clobbr/api?label=api&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/api) [![Tests](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml/badge.svg)](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml)

![Clobbr api endpoint performance and speed test demo](https://user-images.githubusercontent.com/1515742/113618284-be106a00-9657-11eb-9709-04b911e7ccd5.gif)

## Quick start

```bash
npx @clobbr/cli run --url "https://github.com"
```

Run `npx @clobbr/cli` to see all options or
head over to [@clobbr/cli docs](./packages/cli/README.md).

> Not a fan of npx? Get binaries for your favorite OS [here ⬇️ 💿](https://github.com/parsecph/clobbr/releases).
>
> Available for linux, macos and windows.

## What the cli can do

This package can stress-test your API endpoints in various ways so you can get a better idea on how your app would work under a (closer to) real world scenario.

Configure requests, set iterations and analyze response times of your API endpoints in a fashionable ascii chart or jaw-dropping table.

### Basic examples

#### Define iterations

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30                  # or `-i 30`
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619315-1d22ae80-9659-11eb-996f-daa6c68bc682.jpg" />

#### Send requests in parallel

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30 \                # or `-i 30`
  --parallel                       # or `-p`
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619313-1c8a1800-9659-11eb-84c1-af396ae305a6.jpg" />

#### Display a summary table

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30 \                # or `-i 30`
  --table "full"                   # or `-t "full"`
```

<img width="375px" alt="clobbr show detailed api response summary table" src="https://user-images.githubusercontent.com/1515742/113619310-1b58eb00-9659-11eb-921c-46702345499e.jpg" />

#### Display a minimal summary table

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30 \                # or `-i 30`
  --table "compact"                # or `-t "compact"`
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113619304-1a27be00-9659-11eb-92f8-1cea2e32399c.jpg" />


#### Customize Request Method
`GET` is used as the default request method, but you can pass an optional request method, such as `POST`, `PUT`, `PATCH`, `DELETE` etc.

#### Send Headers
Arbitrary request headers are accepted as a JSON file.

> Tip 💡
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
  --url "https://github.com" \    # or `-u <url>`
  --iterations 20 \               # or `-i 30`
  --headerPath "headers.json"     # or `-h "headers.json"
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
  --url "https://github.com" \    # or `-u <url>`
  --iterations 20 \               # or `-i 30`
  --method "POST" \               # or `-m "POST"`
  --dataPath "data.json"          # or `-d "data.json"
```

#### Analyze failed request iterations
By default, details on failed iterations are neatly displayed via the table option.

```bash
npx @clobbr/cli run \
  --url "https://github.com" \    # or `-u <url>`
  --iterations 20 \               # or `-i 30`
  --method "POST" \                 # or `-m "POST"`
  --headerPath "headers.json" \   # or `-h "headers.json"
  --dataPath "data.json" \        # or `-d "data.json"
  --table "compact"               # or `-t "compact`
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113765840-13627f00-971d-11eb-8c45-5f4f39ef7db6.jpg" />

### Coming soon

The CLI is meant to be the 1st UI built on top of @clobbr/api.
A slick UI that you can either run locally or on the web is also in the works, so stay tuned for that!

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)
