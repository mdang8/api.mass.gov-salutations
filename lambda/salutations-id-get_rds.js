'use strict'

const pg = require('pg');

let client;
let connectStr;

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

var getData = function() {
    //const id = event.id !== undefined ? event.id : '';
    const id = 0;

    client.connect();
    var query = client.query("SELECT * FROM Salutations WHERE ID = " + id);

    query.on('row', function(row) {
        console.log(row);
    });

    query.on('end', function() {
        client.end();
    });
};

init();
