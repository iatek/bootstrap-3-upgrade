var port = process.env.PORT || 4000,
    app = require('./app').init(port),
    window = require('jsdom').jsdom().createWindow(),
    $ = require('jquery'),
    request = require('request');
    
/* default route */
app.get('/', function(req,res){
    
    var urlToFetch = req.query["url"],
        fresh = req.query.fresh||false;

    if (!urlToFetch) {
        console.log("show home page");
        res.render("index");
    }
    else {
        
        
    }
});

app.post('/', function(req, res){
    
    var source = req.body["source"];
    var target = convert(source);
    res.json({result:target});

});

app.get('/proxy', function(req, res){
    if (req.param("purl")) {
        request(unescape(req.param("purl")), function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.send(body);
			}
			else {
				res.json({error:"Bad URL request."});
			}
		});
	}
    else {
        res.json({error:"URL is required."});
    }
});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs');
});

var convert = function(str){

    str = str.replace(/container-fluid/g,"container");
    str = str.replace(/row-fluid/g,"row");
    //str = str.replace(/span(?=[1-9|10|11|12])/g,'col col-lg-');
    str = str.replace(/span(?=[1-9|10|11|12])/g,'col-lg-');
    str = str.replace(/offset(?=[1-9|10|11|12])/g,'col-lg-offset-');
    str = str.replace(/(?!class=\")btn(?=[\s\"][^\-|btn])/g,'btn btn-default');
    str = str.replace(/btn-mini/g,'btn-sm');
    str = str.replace(/hero-unit/g,'jumbotron');
    str = str.replace(/nav-list/g,'');
    str = str.replace(/nav-fixed-sidebar/g,'affix');
    //str = str.replace(/(?!class=\")icon/g,'glyphicon');
    //str = str.replace(/[^glyph]icon-(?=[a-zA-Z]+)/g,'glyphicon glyphicon-');
    //str = str.replace(/icon-(?=[a-zA-Z]+)/g,'glyphicon glyphicon-');   
    //str = str.replace(/(?!class=\")icon(?=[\s\"]?[^icon])/g,'glyphicon glyphicon'); works!
    //str = str.replace(/[^glyph]icon-(?=[a-zA-Z])/g,'glyphicon glyphicon-');
    
    str = str.replace(/(='\bicon-)/g,"='glyphicon glyphicon-");
    str = str.replace(/(="\bicon-)/g,"=\"glyphicon glyphicon-");
    str = str.replace(/(=\bicon-)/g,"=glyphicon glyphicon-");
    str = str.replace(/\bclass+(\sicon-)/g,"=\"glyphicon glyphicon-");
    
    str = str.replace(/(?!class=\")brand/g,'navbar-brand');
    str = str.replace(/(?!class=\")btn btn-navbar/g,'navbar-toggle');
    str = str.replace(/nav-collapse/g,'navbar-collapse');
    str = str.replace(/(?!class=\")-phone/g,'-sm');
    str = str.replace(/(?!class=\")-tablet/g,'-md');
    str = str.replace(/(?!class=\")-desktop/g,'-lg');
    
    /*
    $('#ele').remove();
    var ele = $('<body id="ele"></body>');
    ele.html(str);
    ele.appendTo(window);
    
    //navbar
    var nb = $('#ele').find('.navbar');
    if (typeof nb!="undefined"){
        nb.find('.nav').addClass('navbar-nav'); // add the navbar-nav class
        nb.find('.btn').addClass('navbar-btn');
        var nb_inner = nb.find('.navbar-inner'); // remove the 2.x navbar-inner
        var h = nb_inner.html();
        if (typeof h!="undefined"){
            nb.html(h);
        }
    }
    
    //icons
    var icos = $('#ele').find("[class^=icon]");
    
    //imgs
    var imgs = $('#ele img').addClass("img-responsive");
    
    // replace .thumbnails with .media-list
            
    str = $('#ele').html();
      */
      
    return str;
}


