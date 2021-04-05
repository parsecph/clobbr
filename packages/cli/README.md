## @clobbr/cli
[![npm (scoped)](https://img.shields.io/npm/v/@clobbr/cli?label=cli&style=flat)](https://github.com/parsecph/clobbr/tree/master/packages/cli)

```
Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  run [options]   Test an api endpoint/url (<url>), Valid urls begin with http(s)://
  help [command]  display help for command
```

### run

```
Usage: clobbr run [options]

Test an api endpoint/url (<url>), Valid urls begin with http(s)://

Options:
  -u, --url <url>                           url to test
  -v, -m, --method <method>, --verb <verb>  request verb/method to use (default: "get")
  -i, --iterations <iterations>             number of requests to perform (default: "10")
  -p, --parallel                            run requests in parallel (default: false)
  -c, --chart                               display results as chart (default: true)
  -t, --table <table>                       display results as table (none, compact, full) (default: "none")
  -h, --help                                display help for command
```

[See how to get started and other docs here](../../README.md)
