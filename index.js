var express = require('express')
var mongo = require('mongodb').MongoClient

var app = express()
var dbURL = process.env.MONGOLAB_URI

app.get('/:id', function(req, res){
    mongo.connect(dbURL, function(err, db) {
        if(err){ 
            res.status(500).send("unable to connect to db")
            throw err
        }
        
        var urls = db.collection('urls')
        
        urls.findOne({
            short: Number(req.params.id)
        }, function(err, doc){
            if(err) throw err
            
            if(doc){
                res.writeHead(302,
                  {Location: doc.url}
                );
            } else {
                res.status(500).send("short url not found")
            }
            db.close()
            res.end();
        })
    })
    
})


app.get('/new/*', function(req, res){
    
    mongo.connect(dbURL,function(err, db){
        if(err){ 
            res.status(500).send("unable to connect to db")
            throw err
        }
        
        var regex = /^((ftp|http|https):\/\/)www\.([A-z]+)\.([A-z]{2,})/
        var result = {}
        
        if(regex.test(req.params[0])){
            
            var urls = db.collection("urls")
            var param = req.params[0]
            var apiUrl = "https://"+ req.get('host') + "/"
            var key = Math.floor(Math.random() * 90000 + 10000)
            
            urls.findOne({
                url: param
            }, function(err, doc){
                if(err) throw err
                
                if(doc){
                    result.original_url = doc.url
                    result.short_url    = apiUrl+doc.short
                    
                    res.status(200).send(JSON.stringify(result))
                    db.close()
                } else {
                    urls.insert({
                        url: param,
                        short: key
                    }, function(err, data){
                        if(err) throw err
                        
                        var inserted        = data.ops[0]
                        result.original_url = inserted.url
                        result.short_url    = apiUrl+inserted.short
                        
                        res.status(200).send(JSON.stringify(result))
                        db.close()
                    })
                }
            })
            
        } else {
            result.error = "Wrong url format, make sure you have a valid protocol and real site."
            res.status(200).send(JSON.stringify(result))
            db.close()
        }
        
    })
})

.listen(process.env.PORT || 8080)