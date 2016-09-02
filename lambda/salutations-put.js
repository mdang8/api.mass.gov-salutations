'use strict';

const https = require('https');
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const s3obj = new AWS.S3();

exports.handler = (event, context) => {

    const bucket = "salutations-data.api.mass.gov";
    const key = "salutations-data.json";

    // initializes the program by calling the getData function with the updateRecord function as the callback
    getData(updateRecord);

    /**
     * Gets the active JSON data object from the S3 bucket.
     *
     * @param callback      the callback function to call after the object has been retrieved
     *
     * @throws context.fail if there is an error with retrieving the object from the S3 bucket
     * @throws context.fail if there is an error with parsing the JSON data
     */
    function getData(callback) {

        // S3 parameters for download
        var params = {
            Bucket: bucket,
            Key: key
        };

        // gets the data object from the S3 bucket
        s3obj.getObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);

                return context.fail("Error with getting S3 object: " + err);
            } else {
                try {
                    var dataBody = data.Body;
                    var jsonData = JSON.parse(dataBody.toString('utf8'));

                    callback(jsonData);
                } catch (err) {
                    return context.fail("Error with parsing data: " + err);
                }
            }
        });

    }  // end of getData

    /**
     * Updates all the records in the JSON data.
     *
     * @param jsonData      the active JSON data from the S3 bucket
     */
    function updateRecord(jsonData) {
        var records = jsonData.salutationsData;

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
                for (var i = 0; i < records.length; i++) {
                    // condition: do not update id:0
                    if (records[i].id !== '0'){
                        // update the object's parameter value
                        records[i][p] = records[i].hasOwnProperty(p) && records[i][p] !== undefined ? parameters[p] : '';
                    }  // end if
                }  // end for data
            }  // end if parameters
        }  // end for parameters

        // calls the uploadData function with a string of the JSON data as the argument
        uploadData(records);

    }  // end of updateRecord

    /**
     * Uploads the modified JSON data to the S3 bucket.
     *
     * @param jsonData      the modified JSON data to be uploaded
     *
     * @throws context.fail if there is an error on the upload
     */
    function uploadData(jsonData) {
        var stringJSON = JSON.stringify(jsonData);

        var body = "{ \"salutationsData\":\n\n" + stringJSON + "\n\n}";

        // S3 parameters for upload
        var params = {
            Bucket: bucket,
            Key: key,
            Body: body
        };

        // try-catch for uploading errors
        try {
            // uploads the modified data
            s3obj.upload(params, function(err, data) {
                console.log(err, data);
                console.log("Data has been uploaded.");

                getData(showUpdates);
            });
        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on upload: " + err);
        }

    }  // end of uploadData

    /**
     * Returns the new data to show the changes and exits the lambda function.
     *
     * @param jsonData      the modified JSON data that was retrieved from the S3 bucket
     *
     * @return the modified data
     */
    function showUpdates(jsonData) {
        return context.done(null, jsonData.salutationsData);

    }  // end of showUpdates

};  // end of exports handler
