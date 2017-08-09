'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.08.08 16:25:15
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 */

const Logger = require('../');

let logger = new Logger({
    logDir: './test/logs'
});

let loggerWithoutConsole = new Logger({
    logDir: './test/logs',
    printToConsole: false
});

let loggerWithoutStream = new Logger();

let loggerWithLevelWarn = new Logger({
    level: 'warn',
    logDir: './test/logs',
});

describe('#Logger', function() {
    describe('#Logger#trace', function() {
        it('Trace', function() {
            logger.trace('trace 123', {'a': 'aValue'});
        });

        it('Trace without console output', function() {
            loggerWithoutConsole.trace('trace console empty');
        });
    });

    describe('#Logger#error', function() {
        it('Error', function() {
            logger.error(new Error('cloverx-logger Error'));
        });

        it('Error without Stream', function() {
            loggerWithoutStream.error('Error only in console');
        });
    });

    describe('#Logger#LevelFilter', function() {
        it('info', function() {
            loggerWithLevelWarn.info('should be filtered');
        });

        it('warn', function() {
            loggerWithLevelWarn.warn('should be printed');
        });
    });

    describe('#Logger#Rotate', function() {
        it('rotate by day', function(done) {
            logger.info('write before rotate');
            setTimeout(() => {
                logger.info('Write After Rotate');
                done();
            }, 1e3);
        });
    });
});
