const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

const connection = mysql.createConnection({

//  default port if not specified.
port: 3306,

// database user.
user: `root`,

// database password.
password: `yourRootPassword`,
database: `employee_tracker_db`,
});


connection.connect((err) => {
    if (err) throw err;
    whatWouldYouLike();
  });


const whatWouldYouLike = () => {
    inquirer
        .prompt([{
            name: `action`,
            type: `list`,
            message: `What would you like to do?`,
            choices: [
                `Add Department`,
                `Add Role`,
                `Add Employee`,
                `View Department`,
                `View Role`,
                `View Employee`,
                `Update Employee Role`
            ]
        }
    ]).then((answer) => {
            switch (answer.action) {
                case `Add Department`:
                departmentAdd();
                break;

                case `Add Role`:
                roleAdd();
                break;

                case `View Department`:
                departmentView();
                break;

                case `View Role`:
                roleView();
                break;

                case `View Employee`:
                employeeView();
                break;

                case `Exit`:
                connection.end();
                break;
            }
        });


        const departmentAdd = () => {
        inquirer
        .prompt([{
            name: `departmentAdd`,
            type: `list`,
            message: `Choose the department you would like to add.`,
            choices: [
                `Assembly`,
                `Benching`,
                `Machining`,
                `EDM`,
                `Engineering`
            ]
        }])
        .then((answer) => {
            connection.query(
              "INSERT INTO department SET ?", {
                name: answer.departmentAdd
              },
              function (err) {
                  if (err) throw err;
                  console.log("Added" + answer.departmentAdd + "Department");
                whatWouldYouLike();
              }  
            )
        })

        }


        const roleAdd = () => {
            connection.query("SELECT * FROM role", function (err, results){
            if (err) throw err;
            inquirer
            .prompt([{
                name: `roleAdd`,
                type: `list`,
                message: `Choose the role you would like to add.`,
                choices: [
                    `Manager`,
                    `Assistant Manager`,
                    `Team Leader`,
                    `Engineer`,
                    `Designer`
                ]
            },

            {
            name: `salary`,
            type: `number`,
            message: `Enter the salary of this role.`
            },

            // {
            // name: `department_id`,
            // type: `list`,
            // message: `Enter the department id of this role.`,
            // choices: results.map(item => item.name)
            // },

        ])
            .then((answer) => {
                // const departmentChosen = results.find(item => item.name===answer.department_id)

                connection.query(
                  "INSERT INTO role SET ?", {
                    title: answer.roleAdd,
                    salary: answer.salary,
                    department_id: 1
                  },
                  function (err) {
                      if (err) throw err;
                      console.log("Added" + answer.roleAdd + "Role");
                    whatWouldYouLike();
                  }  
                )
            })
            })
            }



            const departmentView = () => {
                connection.query("SELECT * FROM department", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })
            }



            const roleView = () => {
                connection.query("SELECT * FROM role", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })
            }



            const employeeView = () => {
                connection.query("SELECT * FROM employee", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })
            }






}