// Hepler module for datanase connections
const mysql = require("mysql");
const settingsProvider = require("./settingsProvider.js");

let mySqlConnectionProvider = {
    getTestDBConnection: function() {
        return (mysql.createPool(settingsProvider.mySqlConnections.testdb));
    },

    closeConnection: function(con) {
        con.destroy();
    }
}

module.exports.mySqlConnectionProvider = mySqlConnectionProvider;