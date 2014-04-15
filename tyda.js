var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');


http.get('http://tyda.se/search/'+process.argv[2]+'?lang%5B0%5D=en&lang%5B1%5D=sv', function(res){
    var body = '';

    res.on('data', function(d){
      body+= d;
    });

    res.on('end', function(e){
      //var d = fs.readFileSync('test/test.html');

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
