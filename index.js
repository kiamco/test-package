#!/usr/bin/env node

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';


const cp = require('child_process');
const sh = require('shelljs');

const [, , ...args] = process.argv;

const cleanup = () => {
    console.log('Cleaning up.');
    // Reset changes made to package.json files.
    cp.execSync(`git checkout -- packages/*/package.json`);
    // Uncomment when snapshot testing is enabled by default:
    // rm ./template/src/__snapshots__/App.test.js.snap
};

const handleExit = () => {
    cleanup();
    console.log('Exiting without error.');
    process.exit();
};

const handleError = e => {
    console.error('ERROR! An error was encountered while executing');
    console.error(e);
    cleanup();
    console.log('Exiting with error.');
    process.exit(1);
};

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

const newDir = 'api middleware routes database'

sh.mkdir(args);
sh.cd(args);
sh.touch('index.js');

newDir.split(' ').forEach(el => {
    sh.mkdir(el);
});

sh.cd('api');
sh.touch('server.js');
sh.cd('../');
sh.exec('npm init -y');
sh.exec('npm install nodemon knex express sqlite3 dotenv');
sh.exec('npm install');
sh.exec('npx knex init');