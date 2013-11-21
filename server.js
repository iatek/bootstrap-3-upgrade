var port = process.env.PORT || 4000,
    app = require('./app').init(port),
    window = require('jsdom').jsdom().createWindow(),
    $ = require('jquery'),
    request = require('request');
    
/* default route */
app.get('/', function(req,res){
    res.render("index");
});

app.post('/', function(req, res){
    
    var source = req.body["source"];
    var target = convert(source);
    
    if (typeof target!="undefined"&&target.length>0){
        res.json({result:target});
    }
    else {
        res.json({error:"Error: Unable to convert HTML"});
    }

});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs');
});

var rules = [
    {name:"container",regex:/container-fluid/g,rep:"container"},
    {name:"row",regex:/row-fluid/g,rep:"row"},
    {name:"span",regex:/span(?=[1-9|10|11|12])/g,rep:"col-md-"},
    {name:"offset",regex:/offset(?=[1-9|10|11|12])/g,rep:"col-lg-offset-"},
    {name:"btn",regex:/(?!class=\")btn(?=[\s\"][^\-|btn])/g,rep:"btn btn-default"},
    //{name:"btn",regex:/btn/g,rep:"btn btn-default"},
    {name:"btn-mini",regex:/btn-mini/g,rep:"btn-xs"},
    {name:"btn-lg",regex:/btn-large/g,rep:"btn-lg"},
    {name:"btn-small",regex:/btn-small/g,rep:"btn-sm"},
    {name:"input",regex:/input-large/g,rep:"input-lg"},
    {name:"input",regex:/input-small/g,rep:"input-sm"},
    {name:"input",regex:/input-append/g,rep:"input-group"},
    {name:"input",regex:/input-prepend/g,rep:"input-group"},
    {name:"add-on",regex:/add-on/g,rep:"input-group-addon"},
    {name:"label",regex:/(?!class=\")label(?=[\s\"][^\-|label])/g,rep:"label label-default"},
    {name:"hero",regex:/hero-unit/g,rep:"jumbotron"},
    {name:"nav list",regex:/nav-list/g,rep:""},
    {name:"affix",regex:/nav-fixed-sidebar/g,rep:"affix"},
    {name:"icons",regex:/(='\bicon-)/g,rep:"='glyphicon glyphicon-"},
    {name:"icons",regex:/(="\bicon-)/g,rep:"=\"glyphicon glyphicon-"},
    {name:"icons",regex:/(=\bicon-)/g,rep:"=glyphicon glyphicon-"},
    {name:"icons",regex:/\bclass+(\sicon-)/g,rep:"=\"glyphicon glyphicon-"},
    {name:"brand",regex:/(?!class=\")brand/g,rep:"navbar-brand"},
    {name:"btn",regex:/(?!class=\")btn btn-navbar/g,rep:"navbar-toggle"},
    {name:"nav",regex:/nav-collapse/g,rep:"navbar-collapse"},
    {name:"toggle",regex:/nav-toggle/g,rep:"navbar-toggle"},
    {name:"util",regex:/(?!class=\")-phone/g,rep:"-sm"},
    {name:"util",regex:/(?!class=\")-tablet/g,rep:"-md"},
    {name:"util",regex:/(?!class=\")-desktop/g,rep:"-lg"}
    ];

var convert = function(str){
    
    /* known regex string replacements */

    for (var i=0;i<rules.length;i++){
        str = str.replace(rules[i].regex,rules[i].rep);
    }
    
    /* structure changes require DOM manipulation */

    $('#ele').remove();
    //var ele = $('<form id="ele"></form>');
    var ele = $('<textarea id="ele"></textarea>');
    //ele.html(str);
    ele.val(str);
    
    ele = $(ele.val());
    
    ele.appendTo("body");
    
    console.log("--------------------------------"+ele.html());
    
    //navbar structure
    var nb = $('#ele').find('.navbar');
    if (typeof nb!="undefined"){
        nb.addClass('navbar-default');
        nb.find('.nav').addClass('navbar-nav'); // add the navbar-nav class
        nb.find('.btn').addClass('navbar-btn');
        var nb_inner = nb.find('.navbar-inner'); // remove the 2.x navbar-inner
        var h = nb_inner.html();
        
        if (typeof h!="undefined"){
            nb.html(h);
        }
        
        //wrap the brand and nav-toggle with nav-header
        var brand = nb.find(".navbar-brand");
        var togg = nb.find(".navbar-toggle");
        var navbarheader = $('<div class="navbar-header"></div>');
        
        if (typeof brand != "undefined" && typeof togg != "undefined") {
            brand.appendTo(navbarheader);
            togg.appendTo(navbarheader);
            navbarheader.prependTo(nb);
        }
    }
    
    //modal structure
    var md = $('#ele').find('.modal');
    if (typeof md!="undefined"){
        md.removeClass("hide");
        var mdia = $('<div class="modal-dialog"></div>');
        var mc = $('<div class="modal-content"></div>');
        mc.appendTo(mdia);
        $('#ele').find(".modal-header").appendTo(mc);
        $('#ele').find(".modal-body").appendTo(mc);
        $('#ele').find(".modal-footer").appendTo(mc);
        mdia.appendTo(md);
        console.log("modal ele:"+ele.html());
    }
    
    //icons
    var icos = ele.find("[class^=icon]");
    
    //imgs
    var imgs = ele.find('img').addClass("img-responsive");
    
    // replace .thumbnails with .media-list
            
    str = ele.html();
    $('#ele').remove();
      
    return str;
}


