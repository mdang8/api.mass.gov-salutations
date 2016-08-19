'use strict';
let https = require('https');
var AWS = require('aws-sdk');

exports.handler = (event, context) => {

    //declares delRecord variable
    var objDelRecord;

    // makes a GET request to get the active data JSON file from the S3 bucket
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
                        return context.fail("Error with parsing active data JSON body: " + err);
                    }
                });
            });
    };  // end of getData

    // makes a GET request to get the disabled data JSON file from the S3 bucket
    // the getDisabledData function takes in a callback function as an argument
    var getDisabledData = function(callback) {
        https.get("https://s3.amazonaws.com/salutations-data.api.mass.gov/salutations-disabled-data.json",
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
                        body = JSON.parse(body).salutationsDisabledData;

                        // calls the callback function once the data is ready
                        callback(body, objDelRecord);
                    } catch(err) {
                        // returns fail
                        return context.fail("Error with parsing disabled data JSON body: " + err);
                    }
                });
            });
    };  // end of getDisabledData

    // deletes the record with the specified id paramater
    var deleteRecord = function(data) {
        var id = event.id !== undefined ? event.id : '';
        var idIsThere = false;

        //checks for 0 id
        if (id === "0"){
            return context.done(null, "Cannot delete id: 0. Please try a different id.");
        }

        // loops through each object in the JSON data
        for (var i = 0; i < data.length; i++) {

            // compares the input id with the object id
            if (data[i].id === id) {

                // assigns idIsThere check
                idIsThere = true;

                data[i].isDisabled = "true";

                //assign deleted record
                objDelRecord = {
                  "id": data[i].id,
                  "name": data[i].name,
                  "greeting": data[i].greeting,
                  "gender": data[i].gender,
                  "message": data[i].message,
                  "isDisabled": data[i].isDisabled
                };

                //Remove (delete) object from array
                data.splice(i, 1);
                //break;
            }//End if

        }//End For Loop

        //Exits if id is not there
        if (!idIsThere) {
            return context.done(null, "Id not found in record set.");
        } else {
            uploadData(JSON.stringify(data));
            getDisabledData(addToDisabled);
        }

    };//End deleteRecord

    // adds the disabled record to the data in the disabled JSON data file and
    // uploads the modified disabled data to the S3 bucket
    var addToDisabled = function(data, record) {

        // adds the record object to the JSON data array
        data.push(record);

        // calls the uploadDisabledData function with a string of the JSON data
        // as the argument
        uploadDisabledData(JSON.stringify(data));
    };

    // uploads the active data JSON file to the S3 bucket
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

        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on active upload: " + err);
        }
    };  // end of uploadData

    // uploads the disabled data JSON file to the S3 bucket
    var uploadDisabledData = function(body) {
        body = "{ \"salutationsDisabledData\":\n\n" + body + "\n\n}";

        // s3 parameters for uploading
        var s3obj = new AWS.S3({
            params: {
                Bucket: "salutations-data.api.mass.gov",
                Key: "salutations-disabled-data.json",
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

            // returns the deleted record details
            return context.done(null, objDelRecord);


        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on disabled upload: " + err);
        }
    };  // end of uploadData


    // initializes the program by calling the getData function with the updateRecord function as the callback
    getData(deleteRecord);
};  // end of exports handler
