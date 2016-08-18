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

    // updates the record in the JSON data with the specified id
    var updateRecord = function(data) {
        var id = event.id !== undefined ? event.id : '';
        var name = event.name !== undefined ? event.name : '';
        var greeting = event.greeting !== undefined ? event.greeting : '';
        var gender = event.gender !== undefined ? event.gender : '';
        var message = event.message !== undefined ? event.message : '';

        // sets each parameter to be updated
        var parameters = {
            "name": name,
            "greeting": greeting,
            "gender": gender,
            "message": message
        };

        // loops through each element in the JSON data array
        for (var i = 0; i < data.length; i++) {

            // compares the record id with the input id
            if (data[i].id === id) {

                // for each parameter name-key
                for (var p in parameters) {

                    // if the parameter value is not ''
                    if (parameters.hasOwnProperty(p) && parameters[p] !== '') {

                        // checks that the record has the parameter and it is not undefined
                        if (data[i].hasOwnProperty(p) && data[i][p] !== undefined) {

                            // updates the parameter of the record
                            data[i][p] = parameters[p];
                        }  // end if

                    }  // end if

                }  // end for-loop iterating through the parameter names

                // calls the uploadData function with a string of the JSON data as the argument
                uploadData(JSON.stringify(data));
                return;
            }  // end if

        }  // end for-loop iterating through each element in the JSON data array

        // if the for-loop is exited, that means the id was not found in the data
        return context.fail("The specified id does not exist in the data.");

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
        }  // end try-catch

    };  // end of uploadData

    // returns the new data to show the changes and exits the lambda function
    var showUpdates = function(data) {
        var id = event.id !== undefined ? event.id : '';

        // the record object that was updated
        var toShow;

        // iterate through each record in the JSON data
        for (var i = 0; i < data.length; i++) {

            // compares the record id to the input id
            if (data[i].id === id) {

                // sets the record object to return to the user
                toShow = data[i];

                // breaks out of the for-loop because the record has been found
                break;
            }  // end if

        }  // end for-loop

        // returns the updated record
        return context.done(null, toShow);

    };  // end of showUpdates

    // initializes the program by calling the getData function with the updateRecord function as the callback
    getData(updateRecord);

};  // end of exports handler
