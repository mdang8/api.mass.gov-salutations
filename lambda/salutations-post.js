'use strict';
let https = require('https');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var fs = require('fs');

exports.handler = (event, context, callback) => {
    var request = https.get("https://s3.amazonaws.com/salutations-data.api.mass.gov/salutations-data.json",
        function(response) {
            var body = '';

            response.on("data", function(chunk) {
                body += chunk;
            });

            response.on("end", function() {
                try {
                    body = JSON.parse(body);
                } catch(err) {
                    console.error("Error with parsing JSON body.");
                    return;
                }

                addRecord(body);
            });
        });

    var addRecord = function(data) {
        var id = data['salutationsData'].length;  // index starts at 0
        var name = event.name !== undefined ? event.name : '';
        var greeting = event.greeting !== undefined ? event.greeting : '';
        var gender = event.gender !== undefined ? event.gender : '';
        var message = event.message !== undefined ? event.message : '';

        var newRecord = {
            "id": id.toString(),
            "name": name,
            "greeting": greeting,
            "gender": gender,
            "message": message
        }

        data['salutationsData'].push(newRecord);
        writeData(JSON.stringify(data));
        console.log(data);
    }

    var writeData = function(data) {
        fs.writeFile("/tmp/salutations-data.json", data, function(err) {
            if(err)
                context.fail("writeFile failed: " + err);
            else
                console.log("writeFile succeeded");
        });

        uploadData(data);
    }

    var uploadData = function(data) {
        var body = fs.readFile("/tmp/salutations-data.json");
        var s3obj = new AWS.S3({
            params: {
                Bucket: "salutations-data.api.mass.gov",
                Key: "salutations-data.json"
            }
        });

        try {
            s3obj.upload({Body: data}).on('httpUploadProgress', function(evt) {
                console.log(evt);
            }).send(function(err, data) {
                console.log(err, data)
            });
        } catch (err) {
            context.fail("Error on upload.");
        }

        context.done(null, data);
    }
};
