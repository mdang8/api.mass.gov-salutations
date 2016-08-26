'use strict';
let https = require('https');
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

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

    // updates all the records in the JSON data
    var updateRecord = function(data) {
        var name = event.body.name !== undefined ? event.body.name : '';
        var greeting = event.body.greeting !== undefined ? event.body.greeting : '';
        var gender = event.body.gender !== undefined ? event.body.gender : '';
        var message = event.body.message !== undefined ? event.body.message : '';

        // sets each parameter to be updated
        var parameters = {
            "name": name,
            "greeting": greeting,
            "gender": gender,
            "message": message
        };

        // for each parameter name-key
        for (var p in parameters) {
            // if the parameter value is not ''
            if (parameters.hasOwnProperty(p) && parameters[p] !== '') {

                // loops through each element in the JSON data array
                for (var i = 0; i < data.length; i++) {
                    //Condition: do not update id:0
                    if (data[i].id !== '0'){
                       // update the object's parameter value
                       data[i][p] = data[i].hasOwnProperty(p) && data[i][p] !== undefined ? parameters[p] : '';
                    }//End if
                }//End for data
            }//End if parameters
        }//End for parameters

        // calls the uploadData function with a string of the JSON data as the argument
        uploadData(JSON.stringify(data));
    };  // end of updateRecord

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

            // calls the getData function with the showUpdates function as the callback
            getData(showUpdates);

        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on upload: " + err);
        }
    };  // end of uploadData

    // returns the new data to show the changes and exits the lambda function
    var showUpdates = function(data) {
        return context.done(null, data);
    };  // end of showUpdates

    // initializes the program by calling the getData function with the updateRecord function as the callback
    getData(updateRecord);

};  // end of exports handler
