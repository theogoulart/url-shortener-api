var express = require('express')
var mongo = require('mongodb').MongoClient

var app = express()

var dbURL = 'mongodb://localhost:27017/local'

app.get('/new/*', function(req, res){
    
    mongo.connect(dbURL,function(err, db){
        if(err){ 
            res.status(503).send("unable to connect")
            throw err
        }
        
        var regex = /^((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/
        var result = {}
        
        if(regex.test(req.params[0])){
            
            var urls = db.collection("urls")
            var param = req.params[0]
            
            urls.findOne({
                url: param
            }, function(err, doc){
                if(err) throw err
                
                if(doc){
                    result.original_url = param
                    res.status(200).send(JSON.stringify(result))
                } else {
                    urls.insert({
                        url: param
                    }, function(err, data){
                        if(err) throw err
                        
                        var id = data.ops[0]._id
                        result.original_url = param
                        res.status(200).send(JSON.stringify(result))
                    })
                }
                db.close()
            })
            
        } else {
            result.error = "Wrong url format, make sure you have a valid protocol and real site."
            res.status(200).send(JSON.stringify(result))
        }
        
    })
})

.listen(process.env.PORT || 8080)