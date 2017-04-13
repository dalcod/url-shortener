var express = require("express");
var mongodb = require("mongodb");
var mUrl = process.env.MONGOLAB_URI;
var mongoClient = mongodb.MongoClient;
var app = express();
var port = process.env.PORT || 8080;
var i = 0;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("index");
});

app.get(/^\/(http(s)?\:\/\/)?(w){3}\.[\w]+\.[a-zA-Z]{2,3}$/, function(req, res, next){
    
    if(/^http:\/\//.test(url) === true || /^https:\/\//.test(url) === false){
        var url = "https://" + req.url.replace(/http:\/\/|\//g, "");
        console.log(url)
    } else {
        next();
        return;
    }
    mongoClient.connect(mUrl, function(err, db){
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log("Connection established.");
            var collection = db.collection("url");
            collection.find({}).count().then(function(numI){
                if(numI !== 0 && numI !== 0){
                    i = numI;
                }
                i++;
                var newUrl = "localhost:8080/" + i; //"https://url-shortener14.herokuapp.com/" + i
                var doc = {
                    "short_url": newUrl,
                    "full_url": url
                };
                app.locals.shortUrl = collection.insert(doc);
                res.redirect("/response");
                db.close();
            });
        }
    });
});
app.get("/response", function(req, res){

    mongoClient.connect(mUrl, function(err, db){
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log("Connection established.");
            db.collection("url").find({}).toArray(function(err, data){
                app.locals.json = data[data.length - 1];
                res.render("result");
                db.close();
            });

        }
    });
})
app.get("/:num", function(req, res, next){
    var num = req.params.num;
    
    mongoClient.connect(mUrl, function(err, db){
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log("Connection established.");
            db.collection("url").find({
                "short_url": "localhost:8080/" + num //"https://url-shortener14.herokuapp.com/" + num
            }).toArray(function(err, data){
                res.redirect(data[0].full_url);
                db.close();
            });
        }
    });
});
app.use(function(err, req, res){
    res.status(404).render("404");
});
app.listen(port, function(){
    console.log("The app is running.");
});