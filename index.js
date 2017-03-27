var express = require('express')
var mongo = require('mongodb').MongoClient
var url = require('url')

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
            result.original_url = req.params[0]
            result.short_url = ""
        } else {
            result.error = "Wrong url format, make sure you have a valid protocol and real site."
        }
        
        res.status(200).send(JSON.stringify(result))
        
    })
})

.listen(process.env.PORT || 8080)