#!/usr/bin/env node

var yargs = require('yargs')
      .usage('Translate from tyda.se. \n Usage: $0 [text]')
      .example('$0 hello', 'Translate hello to Swedish')
      .example('$0 scharwz -l de', 'Translate scharwz to Swedish')
      .default('l', 'en')
      .default('t', 'sv')
      .alias('l', 'lang')
      .alias('h', 'help')
      .demand(['l','t']);
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


tyda.translate(yargs.argv._[0], yargs.argv.t, yargs.argv.l, function(err, res){
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
