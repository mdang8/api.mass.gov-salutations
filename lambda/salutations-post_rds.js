'use strict'

const pg = require('pg');

let client;
let connectStr;

init();

/**
 * Initializer function
 */
function init() {
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
function getData() {
    var queryStr = "SELECT * FROM Salutations";

    sendQuery(queryStr);
};

/**
 * Makes the connection with the PostgreSQL client and sends the query to the database.
 */
function sendQuery(queryStr) {
    client.connect();
    var query = client.query(queryStr);

    let data = '';

    query.on('row', function(row) {
        console.log(row);
        data += row;
    });

    query.on('end', function() {
        client.end();

        addrecord(data);
    });
};

function addRecord(data) {
    // const name = event.name !== undefined ? event.name : '';
    // const greeting = event.greeting !== undefined ? event.greeting : '';
    // const gender = event.gender !== undefined ? event.gender : '';
    // const message = event.message !== undefined ? event.message : '';

    const name = "RDS_name_test";
    const greeting = "RDS_greeting_test";
    const gender = "RDS_gender_test";
    const message = "RDS_message_test";

    let counter = 0;

    console.log(data);
    console.log(JSON.parse(data));
};
