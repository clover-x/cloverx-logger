# cloverx-logger

## Install
```shell
npm i cloverx-logger --save
```

## Usage
```javascript
'use strict';
cont Logger = require('cloverx-logger');

/**
 * 构造函数
 * @param {Object} options
 * @param {String} options.logDir - 日志输出目录，如果为空，则不记录到文件
 * @param {Boolean} options.printToConsole - 是否输出日志到终端，默认 true
 * @param {string} options.level - 日志输出起始级别
 */
let logger = new Logger({
    // ...
});

logger.trace(...); // 同 console.log 的传参方式
```
