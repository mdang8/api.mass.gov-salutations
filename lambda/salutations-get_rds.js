'use strict'

const pg = require('pg');

let client;
let connectStr;

/**
 * Initializer function
 */
var init = function() {
    var rds_host = "apitestdb.c3cug6cay6am.us-east-1.rds.amazonaws.com";
    var name = "myadmin";
    var password = "apitestpass"
    var db_name = "massitapi";
    var port = 5432;
    var table = "Salutations";

    connectStr = "postgres://" + name + ":" + password + "@" + rds_host + ":" + port + "/" + db_name;

    client = new pg.Client(connectStr);

    getData();
};

/**
 * Gets the query parameters from the event and creates a PostgreSQL query string.
 */
var getData = function() {
    // const name = event.name !== undefined ? event.name : '';
    // const greeting = event.greeting !== undefined ? event.greeting : '';
    // const gender = event.gender !== undefined ? event.gender : '';
    // const message = event.message !== undefined ? event.message : '';

    const name = '';
    const greeting = '';
    const gender = '';
    const meeting = '';

    if (name === '' && greeting === '' && gender === '' && message === '') {
        console.log("Return all.");
        var queryStr = "SELECT * FROM Salutations";

        sendQuery(queryStr);
        return;
    }
};

/**
 * Makes the connection with the PostgreSQL client and sends the query to the database.
 */
var sendQuery = function(queryStr) {
    client.connect();
    var query = client.query(queryStr);

    query.on('row', function(row) {
        console.log(row);
    });

    query.on('end', function() {
        client.end();
    });
};

init();
