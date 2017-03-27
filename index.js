var express = require('express')
var mongo = require('mongodb').MongoClient
var app = express()

var dbURL = 'mongodb://localhost:27017/local'

app.get('', function(req, res){
    
    mongo.connect(dbURL,function(err, db){
        if(err){ 
            res.status(503).send("unable to connect")
            throw err
        }
        
        var result = {}
        
        result.original_url = ""
        result.short_url = ""
        
        res.set
        res.status(200).send(JSON.stringify(result))
        
    })
})

.listen(process.env.PORT || 8080)