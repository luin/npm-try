# npm-try

🚆 Quickly try npm packages without writing boilerplate code.

## Install

```shell
$ npm install -g @luin/npm-try
```

## Usage

npm-try provides a REPL interface for you to try NPM packages without writing any boilerplate code.

Simply run `npm-try [packages ..]` anywhere on the shell and npm-try will install the packages and show a REPL interface which has all packages required and assigned to variables.

## Features

* Super easy to use!
* npm-try even defines variables for you
* Top-level `await` support (requires Node.js >= 10)

## Examples

Wanna try the `capitalize` method of lodash package?

```shell
$ npm-try lodash
✔ const lodash = require('lodash')
> lodash.capitalize('hello world')
'Hello world'
```

Would like to try multiple packages at the same time?

```shell
$ npm-try lodash underscore
✔ const lodash = require('lodash')
✔ const underscore = require('underscore')
> lodash.first([1, 2, 3])
1
> underscore.first([1, 2, 3])
1
```

A previous version? You can specify versions with `@` symbol (Missing the old days when the `pluck` still exists).:

```shell
➜ npm-try lodash@3
✔ const lodash = require('lodash')
> lodash.pluck
[Function: pluck]
```

Asynchronous operations? `await` is supported out-of-the-box. Let's try ioredis:

```shell
$ npm-try ioredis
✔ const Redis = require('ioredis')
> const redis = new Redis()
undefined
> await redis.get('foo')
'123'
```

## Create a Project
REPL is not enough sometimes when you want to write more code to test with packages. npm-try offers `--out-dir`/`-o` option to create a self-contained project so you can write your test code at the drop of a hat.

```shell
$ npm-try lodash -o try-lodash
✔ Installing lodash...
✔ The project created at /Users/luin/try-lodash
```

## Limitations

Testing multiple versions of the same package is not supported. The following command will only have lodash@3 provided:

```shell
$ npm-try lodash@4 lodash@3
✔ const lodash = require('lodash')
✔ const lodash = require('lodash')
> lodash.VERSION
'3.10.1'
```

## License

MIT
