
var https = require('https');
var cheerio = require('cheerio');

exports.translate = function(text, lang, trans, cb){
  https.get('https://tyda.se/search/'+text+'?lang%5B0%5D='+lang+'&lang%5B1%5D='+trans, function(res){
      var body = '';

      res.on('data', function(d){
        body+= d;
      });

      res.on('end', function(e){
        var c = cheerio.load(body.toString());

        var lastLang = '';
        var translations = { };
        c('.list-translations').children('li:not(.item-title)').find('a').each(function(i, obj){

          var item = c(this);
          var translatedText = item.text().replace(/(^\s+|\s+$|\n)/,'');

          var lang = item.parent().parent().find('.item-title').text().replace(/(^\s+|\s+$|\n)/,'');
          if(lastLang != lang){
            if(lang.length > 0){
              translations[lang] = [];
              lastLang = lang;
            }
          }

          if(translatedText.length > 0 &&
            translations[lang].indexOf(translatedText) === -1){

            translations[lang].push(translatedText);
          }
        });

        cb(null, translations);

      });

      res.on('error', function(err){
        return cb(err);
      });
  }).on('error', function(err){
    return cb(err);
  });
};
