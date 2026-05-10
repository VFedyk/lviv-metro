#!/usr/bin/env node
import { program as app } from 'commander';
import pkg from '../package.json' with { type: 'json' };

app
  .version(pkg.version)
  .command('news', 'shows the news about Lviv Metro (in Ukrainian)')
  .command('check-existence', 'checks if Lviv Metro is already built')
  .command('map', 'opens Lviv Metro map in your default browser')
  .parse(process.argv);
