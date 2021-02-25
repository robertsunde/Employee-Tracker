const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

const connection = mysql.createConnection({

//  default port if not specified.
port: 7070,

// database user.
user: `root`,

// database password.
password: `yourRootPassword`,
database: `empoloyee_tracker_db`,
});


connection.connect((err) => {
    if (err) throw err;
    runSearch();
  });

const whatWouldYouLike = () => {
    inquirer
        .prompt({
            name: `action`,
            type: `list`,
            message: `What would you like to do?`,
            choices: [
                ``



            ]
        })
}