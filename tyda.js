var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

http.get('http://blog.simondev.net', function(res){
    var body = '';

    res.on('data', function(d){
      body+= d;
    });

    res.on('end', function(e){
      var d = fs.readFileSync('test/test2.html');

      var c = cheerio.load(d.toString());

      var lastLang = '';
      c('.list-translations').children('li:not(.item-title)').find('a').each(function(i, obj){

        var item = c(this);
        var text = item.text().replace(/^\s*/,'').replace(/\s*/,'').replace(/\n/g, '');

        var lang = item.parent().parent().find('.item-title').text().replace(/^\s+/,'').replace(/\s+$/,'').replace(/\n/g,'');
        if(lastLang != lang){
          console.log(lang);
          lastLang = lang;
        }

        if(text.length > 0){
          console.log(text);
        }
      });

    });
}).on('error', function(err){
  console.log(err);
});
