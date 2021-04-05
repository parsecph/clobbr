<p align="center">
  <img witdh="150px" height="150px" alt="clobbr grid logo" src="https://user-images.githubusercontent.com/1515742/80861783-dcfcc400-8c70-11ea-89c6-671dbdff6f33.png" /> <br/><br/>

  <img witdh="20px" height="20px" alt="clobbr typeface logo" src="https://user-images.githubusercontent.com/1515742/80861788-de2df100-8c70-11ea-8a56-155eef6691e8.png" />
</p>

# Clobbr - api speed testing

Test your api endpoints to check how well they perform under multiple requests (clobber those APIs!)

[![npm (scoped)](https://img.shields.io/npm/v/@clobbr/cli?label=cli&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/cli) [![npm (scoped)](https://img.shields.io/npm/v/@clobbr/api?label=api&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/api) [![Tests](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml/badge.svg)](https://github.com/parsecph/clobbr/actions/workflows/nodejs.yml)

![Clobbr api endpoint performance and speed test demo](https://user-images.githubusercontent.com/1515742/113618284-be106a00-9657-11eb-9709-04b911e7ccd5.gif)

### Quick start

```bash
npx @clobbr/cli run --url "https://github.com"
```

Run `npx @clobbr/cli` to see all options or
head over to [@clobbr/cli docs](./packages/cli/README.md).

> Not a fan of npx, get the binaries for your favorite OS [here ⬇️ 💿](https://github.com/parsecph/clobbr/releases).
>
> Available for linux, macos and windows.

### What the cli can do

This package can clobbr your API endpoints in various ways to stress-test how they do in either parallel or in sequence.
After all iterations are complete, you'll be able to analyze reponse times of your API endpoints in a fasionable ascii chart or eye-catching ascii table.

#### Basic examples

##### Define iterations

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30                  # or `-i 30`
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619315-1d22ae80-9659-11eb-996f-daa6c68bc682.jpg" />

##### Send requests in parallel

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30                  # or `-i 30`
  --parallel                       # or `-p`
```

<img width="375px" alt="clobbr send api requests in parallel" src="https://user-images.githubusercontent.com/1515742/113619313-1c8a1800-9659-11eb-84c1-af396ae305a6.jpg" />

##### Display a summary table

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30                  # or `-i 30`
  --table "full"                   # or `-t "full"`
```

<img width="375px" alt="clobbr show detailed api response summary table" src="https://user-images.githubusercontent.com/1515742/113619310-1b58eb00-9659-11eb-921c-46702345499e.jpg" />

##### Display a minimal summary table

```bash
npx @clobbr/cli run \
  --url "https://github.com" \     # or `-u <url>`
  --iterations 30                  # or `-i 30`
  --table "compact"                # or `-t "compact"`
```

<img width="375px" alt="clobbr show minimal api response summary table" src="https://user-images.githubusercontent.com/1515742/113619304-1a27be00-9659-11eb-92f8-1cea2e32399c.jpg" />

### Coming soon

Support for passing headers and payload data:

- [x] @clobbr/api support
- [ ] @clobbr/cli support

The CLI is meant to be the 1st UI built on top of @clobbr/api.
A slick UI that you can either run locally or on the web is also in the works, so stay tuned for that!

![Clobbr icon](https://user-images.githubusercontent.com/1515742/80861773-da9a6a00-8c70-11ea-9671-77e1bb2dea04.png)
