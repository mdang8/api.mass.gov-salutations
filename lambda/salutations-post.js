'use strict';
let https = require('https');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var fs = require('fs');

exports.handler = (event, context) => {

    // makes a GET request to get the JSON file from the S3 bucket
    // the getData function takes in a callback function as an argument
    var getData = function(callback) {
        https.get("https://s3.amazonaws.com/salutations-data.api.mass.gov/salutations-data.json",
            function(response) {
                var body = '';

                // accepts data stream and adds to body variable
                response.on("data", function(chunk) {
                    body += chunk;
                });

                // triggers when data stream is complete
                response.on("end", function() {
                    try {
                        // parses body variable data into object array
                        body = JSON.parse(body).salutationsData;

                        // calls the callback function once the data is ready
                        callback(body);
                    } catch(err) {
                        // returns fail
                        return context.fail("Error with parsing JSON body: " + err);
                    }
                });
            });
    };  // end of getData

    // adds a new record to the JSON data
    var addRecord = function(data) {
        var id = data.length;  // index starts at 0
        var name = event.name !== undefined ? event.name : '';
        var greeting = event.greeting !== undefined ? event.greeting : '';
        var gender = event.gender !== undefined ? event.gender : '';
        var message = event.message !== undefined ? event.message : '';

        // the new record object to add with the parameters from the event
        var newRecord = {
            "id": id.toString(),
            "name": name,
            "greeting": greeting,
            "gender": gender,
            "message": message
        };

        // adds the new record to the JSON array
        data.push(newRecord);

        // calls the writeData function with a string of the JSON data as the argument
        uploadData(JSON.stringify(data));
    };  // end of addRecord

    // uploads the JSON file to the S3 bucket
    var uploadData = function(body) {
        body = "{ \"salutationsData\":\n\n" + body + "\n\n}";

        // s3 parameters for uploading
        var s3obj = new AWS.S3({
            params: {
                Bucket: "salutations-data.api.mass.gov",
                Key: "salutations-data.json",
                //ContentType: "text/html",
                Body: body
            }
        });

        // try-catch for uploading errors
        try {
            // uploads the modified data
            s3obj.upload().on('httpUploadProgress', function(evt) {
                console.log(evt);
            }).send(function(err, data) {
                console.log(err, data);
            });

            // waits one second before making another GET request in case of latency
            setTimeout(function() {
                // calls the getData function with the showUpdates function as the callback
                getData(showUpdates);
            }, 1000);

        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on upload: " + err);
        }
    };  // end of uploadData

    // returns the new data to show the changes and exits the lambda function
    var showUpdates = function(data) {
        return context.done(null, data);
    };  // end of showUpdates

    // initializes the program by calling the getData function with the addRecord function as the callback
    getData(addRecord);

};  // end of exports handler
