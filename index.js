'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.08.08 15:41:24
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 一个最简单的日志模块
 */
const fs = require('fs');
const util = require('util');
const moment = require('moment');
const chalk = require('chalk');

const LEVEL_ARRAY = {
    'trace': 0,
    'info': 1,
    'warn': 2,
    'error': 3
};

class Logger {
    /**
     * 构造函数
     * @param {Object} options
     * @param {String} options.logDir - 日志输出目录，如果为空，则不记录到文件
     * @param {Boolean} options.printToConsole - 是否输出日志到终端，默认 true
     * @param {string} options.level - 日志输出起始级别
     */
    constructor(options = {}) {
        this.printToConsole = typeof(options.printToConsole) === 'undefined' ? true : options.printToConsole;
        // 日志标准输出流
        this.stream = {};

        if(options.logDir) {
            this._rotate(options.logDir);
        }

        // startLevelIndex
        if(options.level) {
            this.startLevelIndex = LEVEL_ARRAY[options.level];
        }
    }

    trace(...args) {
        let logStr = chalk.white.bold(`[TRACE] ${this._timestamp()}`) + util.format(' -', ...args) + '\n';
        this._output('stdout', logStr, 'trace');
    }

    info(...args) {
        let logStr = chalk.blue.bold(`[INFO] ${this._timestamp()}`) + util.format(' -', ...args) + '\n';
        this._output('stdout', logStr, 'info');
    }

    warn(...args) {
        let logStr = chalk.yellow.bold(`[WARN] ${this._timestamp()}`) + util.format(' -', ...args) + '\n';
        this._output('stderr', logStr, 'warn');
    }

    error(...args) {
        let logStr = chalk.red.bold(`[ERROR] ${this._timestamp()}`) + util.format(' -', ...args) + '\n';
        this._output('stderr', logStr, 'error');
    }

    /**
     * @param {enum} type - stdout，stderr
     * @param {string} logStr - 文本日志
     */
    _output(type, logStr, level) {
        if(this.startLevelIndex) {
            if(LEVEL_ARRAY[level] < this.startLevelIndex) return;
        }

        // 如果存在日志目录，则输出日志到文件流
        if(this.stream[type]) {
            this.stream[type].write(logStr);
        }
        
        if(this.printToConsole) {
            process[type].write(logStr);
        }
    }

    _timestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 按日生成日志文件
     */
    _rotate(logDir) {
        let date = moment().format('YYYYMMDD');
        // 备份原文件流
        let streamPre = Object.assign({}, this.stream);

        // 创建日志标准输出流
        this.stream.stdout = fs.createWriteStream(`${logDir}/${date}-stdout.log`, {
            flags: 'a'
        });
        // 创建日志错误输出流
        this.stream.stderr = fs.createWriteStream(`${logDir}/${date}-stderr.log`, {
            flags: 'a'
        });

        // 关闭旧文件流
        for(let key in streamPre) {
            if(!{}.hasOwnProperty.call(streamPre, key)) {
                continue;
            }
            fs.closeSync(streamPre[key].fd);
            console.log(streamPre[key].fd);
        }

        // 计算下次 rotate 时间
        let nextRotateTime = moment(date).add(1, 'd').valueOf();
        setTimeout(this._rotate.bind(this), nextRotateTime - Date.now() + 60, logDir);
    }
}

module.exports = Logger;
