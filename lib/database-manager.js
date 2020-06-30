const mysql = require("mysql");

/**
 * Database Manager
 * @author Ashley Scott
 */
class DatabaseManager {
    /**
     * Constructor
     * Initialises the object.
     * @param {string} hostname | Hostname of the server to connect to
     * @param {string} username | Username to use for logging in
     * @param {string} password | Password to use for logging in
     * @param {string} database | Database to use
     */
    constructor(hostname, username, password, database) {
        this.connection = mysql.createConnection({
            host: hostname,
            user: username,
            password: password,
            database: database,
            port: 3306,
            multipleStatements: true
        });
    }

    /**
     * Connects to the database using the pre-defined connection.
     */
    async connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect((error) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
        })
    }

    /**
     * Disconnects from the database.
     */
    async disconnect() {
        return new Promise((resolve, reject) => {
            this.connection.end((error) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            });
        });
    }

    /**
     * Selects data from a table.
     * @param {string} columns | Columns to pick from the database
     * @param {string} table   | Table to get data from
     * @param {object} where   | Where conditions to be used
     */

    async select(columns, table, where) {
        return new Promise((resolve, reject) => {
            let tableparams = [table];
            let queryAppendix = '';

            if (where != null) {
                Object.keys(where).forEach((key) => {
                    tableparams.push({ [key]: where[key] });
                })
            }

            if (tableparams.length > 1) {
                queryAppendix = 'WHERE ?';
                queryAppendix += ' AND ?'.repeat(tableparams.length - 2);
            }

            this.connection.query(`SELECT ${columns} FROM ?? ${queryAppendix}`, tableparams, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }



    /**
     * Updates data in a table
     * @param {string} table | Table to update
     * @param {object} set   | Values to change
     * @param {object} where | Conditions for the selection
     */
    async update(table, set, where) {
        return new Promise((resolve, reject) => {
            let tableparams = [table, set];
            let queryAppendix = '';

            if (where != null) {
                Object.keys(where).forEach((key) => {
                    tableparams.push({ [key]: where[key] });
                })
            }

            if (tableparams.length > 2) {
                queryAppendix = 'WHERE ?';
                queryAppendix += ' AND ?'.repeat(tableparams.length - 3);
            }

            this.connection.query(`UPDATE ?? SET ? ${queryAppendix}`, tableparams, (error, results, fields) => {
                if (error) {
                    reject(error);
                }

                resolve(results);
            });
        });
    }

    /**
     * Inserts data in a table
     * @param {string} table | Table to insert
     * @param {object} set   | Values to insert
     */
    async insert(table, value) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO ?? SET ?', [table, value], (error, results, fields) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }

    /**
     * Deletes data from a table
     * @param {string} table | Table to delete from
     * @param {object} where | Conditions to be used
     */
    async delete(table, where) {
        return new Promise((resolve, reject) => {
            let tableparams = [table];
            let queryAppendix = '';

            if (where != null) {
                Object.keys(where).forEach((key) => {
                    tableparams.push({ [key]: where[key] });
                })
            }

            if (tableparams.length > 1) {
                queryAppendix = 'WHERE ?';
                queryAppendix += ' AND ?'.repeat(tableparams.length - 2);
            }

            this.connection.query(`DELETE FROM ?? ${queryAppendix}`, tableparams, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }

    /**
     * Inserts or updates a record
     * @param {string} table  | Table to be used
     * @param {object} values | Values to insert or update
     * @param {object} keys   | Keys to be used for upsert
     */
    async upsert(table, values, keys) {
        let keyUpdate = "";

        keys.forEach(k => {
            keyUpdate += `${k} = VALUES(${k}),`;
        });

        keyUpdate = keyUpdate.slice(0, -1);

        return new Promise((resolve, reject) => {
            this.connection.query(`START TRANSACTION; INSERT INTO ?? ( ${this.connection.escape(keys)} ) VALUES ? ON DUPLICATE KEY UPDATE ${keyUpdate}; COMMIT;`, [table, values], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        })
    }

}

module.exports = DatabaseManager;
