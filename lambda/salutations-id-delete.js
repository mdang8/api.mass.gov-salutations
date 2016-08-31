'use strict';
const https = require('https');
const AWS = require('aws-sdk');
const s3obj = new AWS.S3();

exports.handler = (event, context) => {

    const bucket = "salutations-data.api.mass.gov";

    //declares delRecord variable
    var objDelRecord;

    var key;

    // initializes the program by calling the getData function with the updateRecord function as the callback
    getData(deleteRecord);

    // gets the active JSON data object from the S3 bucket
    //noinspection JSAnnotator
    function getData(type, callback) {
        if (type === "active") {
            key = "salutations-data.json";
        } else {
            key = "salutations-disabled-data.json";
        }

        var params = {
            Bucket: bucket,
            Key: key
        };

        s3obj.getObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                return context.fail("Error with getting " + type + " S3 object: " + err);
            } else {
                try {
                    var dataBody = data.Body;
                    var jsonData = JSON.parse(dataBody.toString('utf8'));

                    if (type === "active") {
                        callback(jsonData);
                    } else {
                        callback(jsonData, objDelRecord);
                    }
                } catch (err) {
                    return context.fail("Error with parsing " + type + " data: " + err);
                }
            }
        });
    }  // end of getData

    // deletes the record with the specified id paramater
    function deleteRecord(data) {
        var records = data.salutationsData;

        var id = event.params.id !== undefined ? event.params.id : '';
        var idIsThere = false;

        //checks for 0 id
        if (id === "0"){
            return context.fail("Cannot delete id: 0. Please try a different id.");
        }

        // loops through each object in the JSON data
        for (var i = 0; i < records.length; i++) {

            // compares the input id with the object id
            if (records[i].id === id) {

                // assigns idIsThere check
                idIsThere = true;

                records[i].isDisabled = "true";

                //assign deleted record
                objDelRecord = {
                  "id": records[i].id,
                  "name": records[i].name,
                  "greeting": records[i].greeting,
                  "gender": records[i].gender,
                  "message": records[i].message,
                  "isDisabled": records[i].isDisabled
                };

                //Remove (delete) object from array
                records.splice(i, 1);
                //break;
            }//End if

        }//End For Loop

        //Exits if id is not there
        if (!idIsThere) {
            return context.fail("Id not found in record set.");
        } else {
            uploadData(JSON.stringify(records), function() {
                getData("disabled", addToDisabled);
            });
        }

    }  //End deleteRecord

    // adds the disabled record to the data in the disabled JSON data file and
    // uploads the modified disabled data to the S3 bucket
    function addToDisabled(data, newRecord) {
        var records = data.salutationsDisabledData;

        // adds the record object to the JSON data array
        records.push(newRecord);

        // calls the uploadDisabledData function with a string of the JSON data
        // as the argument
        uploadData(JSON.stringify(records), "disabled", function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                return context.done(null, objDelRecord);
            }
        });
    }

    // uploads the active data JSON file to the S3 bucket
    function uploadData(body, type, callback) {
        if (type === "active") {
            body = "{ \"salutationsData\":\n\n" + body + "\n\n}";
        } else {
            body = "{ \"salutationsDisabledData\":\n\n" + body + "\n\n}";
        }

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
                console.log(type + " data has been uploaded.");

                callback();
            });
        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on " + type + " upload: " + err);
        }

        callback();
    }  // end of uploadData

    // uploads the disabled data JSON file to the S3 bucket
    function uploadDisabledData(body) {
        body = "{ \"salutationsDisabledData\":\n\n" + body + "\n\n}";

        // s3 parameters for uploading
        var disabledParams = {
            Bucket: "salutations-data.api.mass.gov",
            Key: "salutations-disabled-data.json",
            Body: body
        };

        // try-catch for uploading errors
        try {
            // uploads the modified data
            s3obj.upload(disabledParams, function(err, data) {
                console.log(err, data);
                console.log("Disabled data has been uploaded.");

                // returns the deleted record details
                return context.done(null, objDelRecord);
            });
        } catch (err) {
            // exits lambda fucntion, returns fail
            return context.fail("Error on disabled upload: " + err);
        }
    }  // end of uploadData

};  // end of exports handler
