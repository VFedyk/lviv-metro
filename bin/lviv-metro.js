#!/usr/bin/env node
const app = require('commander');
const { version } = require('../package');

app
  .version(version)
  .command('news', 'shows the news about Lviv Metro (in Ukrainian)')
  .command('check-existence', 'checks if Lviv Metro is already built')
  .command('map', 'opens Lviv Metro map in your default browser')
  .parse(process.argv);