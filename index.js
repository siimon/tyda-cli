#!/usr/bin/env node

var yargs = require('yargs')
      .usage('Translate from tyda.se. \n Usage: $0 [text]')
      .example('$0 hello', 'Translate hello to Swedish')
      .example('$0 schwarz -t de', 'Translate schwarz to Swedish')
      .default('t', 'en')
      .alias('t', 'to')
      .alias('h', 'help');

var tyda = require('./tyda');

if(yargs.argv.help){
  console.log(yargs.help());
  return;
}

if(yargs.argv._.length <= 0){
  console.error('Missing text to translate \n');
  console.log(yargs.help());
  return;
}

tyda.translate(yargs.argv._[0], 'sv', yargs.argv.to, function(err, res){
  if(err){
    return console.error(err);
  }

  for(var i in res){
    var translations = res[i];
    console.log(i);
    for(var t in translations){
      console.log(translations[t]);
    }
    console.log('');
  }
});
