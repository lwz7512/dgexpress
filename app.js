
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var phantom=require('node-phantom');
var fs = require("fs");


var app = express();

var _server = "http://localhost";
var _ph;//cached connection to phantomjs process
var _charttypes = {};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/create', function(req, res, next){
  var charttype = req.body.charttype;
  console.log(">>> processing: "+charttype);

  var content = req.body.json;
  var template = _server+ ":"+ app.get('port')+"/templates/"+charttype+".html";
  console.log(template);
  
  renderByJson(content, template, res, charttype+'_json.png');

});

console.log(">>> connect phantom... ");
phantom.create(function(err,ph) {
    _ph = ph;
    console.log(">>> phantom connected!");
});//end of phantom

/*
 * create image file with json data through phantomjs
 *
 * @param content: json string of chart;
 * @param template: chart render page url;
 * @param res: express server response object;
 * @param filename: image file name to be created;
 */
function renderByJson(content, template, res, filename) {
    var filepath = __dirname + '/public/images/' + filename;

    console.log(">>> 1.1: "+ new Date().getTime());

    _ph.createPage(function(err,page) {
        console.log(">>> 1.2: "+ new Date().getTime());
      page.open(template, function(err,status) {
        console.log(">>> 2: "+ new Date().getTime());
        console.log(">>> local template opened: "+status);
        
        page.evaluate(function(json) {
            window.drawByJSON(json);//feed json data
        }, function(err, result){
            console.log(">>> 4: "+ new Date().getTime());
            /*** create chart image here! ***/
            page.render(filepath, function(err){
                
                console.log(">>> chart rendered!");

                var result = {};
                result.size = getFilesizeInKB(filepath);
                result.url = _server+ ':'+ app.get('port')+ '/images/' + filename;
                
                console.log(">>> 5: "+ new Date().getTime());
                console.log(">>> render completed!");

                res.send(JSON.stringify(result));//output to browser
            });

        }, content);
        console.log(">>> 3: "+ new Date().getTime());

      });//end of page.open
    });//end of createPage

}


function getFilesizeInKB(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes/1000.0 + 'KB';
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('>>> Express server listening on port ' + app.get('port'));
});



