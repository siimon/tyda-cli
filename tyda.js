var http = require('http');
var cheerio = require('cheerio');
var yargs = require('yargs')
      .usage('Translate from tyda.se. \n Usage: $0 [text]')
      .example('$0 hello', 'Translate hello to Swedish')
      .example('$0 scharwz -l de', 'Translate scharwz to Swedish')
      .default('l', 'en')
      .default('t', 'sv')
      .alias('l', 'lang')
      .alias('h', 'help')
      .demand(['l','t']);

if(yargs.argv.help){
  console.log(yargs.help());
  return;
}

if(yargs.argv._.length <= 0){
  console.log('Missing text to translate');
  console.log('');
  console.log(yargs.help());
  return;
}

http.get('http://tyda.se/search/'+yargs.argv._[0]+'?lang%5B0%5D='+yargs.argv.lang+'&lang%5B1%5D='+yargs.argv.t, function(res){
    var body = '';

    res.on('data', function(d){
      body+= d;
    });

    res.on('end', function(e){
      var c = cheerio.load(body.toString());

      var lastLang = '';
      c('.list-translations').children('li:not(.item-title)').find('a').each(function(i, obj){

        var item = c(this);
        var text = item.text().replace(/^\s+/,'').replace(/\s+/,'').replace(/\n/g, '');

        var lang = item.parent().parent().find('.item-title').text().replace(/^\s+/,'').replace(/\s+$/,'').replace(/\n/g,'');
        if(lastLang != lang){
          if(lang.length > 0){
            console.log('');
            console.log(lang);
            lastLang = lang;
          }
        }

        if(text.length > 0){
          console.log(text);
        }
      });

    });
}).on('error', function(err){
  console.log(err);
});
