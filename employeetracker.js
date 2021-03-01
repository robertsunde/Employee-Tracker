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


// Main prompt questions for database build.
const whatWouldYouLike = () => {
    inquirer
        .prompt([{
            name: `action`,
            type: `list`,
            message: `Welcome to Rob's Employee Database!
  What would you like to do?`,
            choices: [
                `Add Department`,
                `Add Role`,
                `Add Employee`,
                `View Department`,
                `View Role`,
                `View Employee`,
                `Update Employee Role`,
                `Exit`
            ]
        }
// switch cases that allow each selected answer to link to a like function.
    ]).then((answer) => {
            switch (answer.action) {
                case `Add Department`:
                departmentAdd();
                break;

                case `Add Role`:
                roleAdd();
                break;

                case `Add Employee`:
                employeeAdd();
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

                case `Update Employee Role`:
                employeeModifyRole();
                break;

                case `Exit`:
                connection.end();
                break;
            }
        });

// function for adding a department.
        const departmentAdd = () => {
        inquirer
        .prompt([{
            name: `departmentAdd`,
            type: `input`,
            message: `Enter the name of the department you would like to add`,
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

// function for adding a role.
        const roleAdd = () => {
            connection.query("SELECT * FROM department", function (err, results){
            if (err) throw err;
            inquirer
            .prompt([{
                name: `roleAdd`,
                type: `input`,
                message: `Enter the role you would like to add.`,
            },

            {
            name: `salary`,
            type: `number`,
            message: `Enter the salary of this role.`
            },

            {
            name: `department_id`,
            type: `list`,
            message: `Enter the department id of this role.`,
            choices: results.map(item => item.name)
            },

        ])
            .then((answer) => {
                const departmentChosen = results.find(item => item.name===answer.department_id)

                connection.query(
                  "INSERT INTO role SET ?", {
                    title: answer.roleAdd,
                    salary: answer.salary,
                    department_id: departmentChosen.id
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


// function for adding an employee.
const employeeAdd = () => {
    connection.query("SELECT * FROM role", function (err, results){
    if (err) throw err;
    inquirer
    .prompt([{
        name: `employeeAdd`,
        type: `input`,
        message: `Enter the first name of the employee you would like to add.`,
    },

    {
    name: `last_name`,
    type: `input`,
    message: `Enter the last name of the employee you would like to add.`
    },

    {
    name: `role_id`,
    type: `list`,
    message: `Enter the role id.`,
    choices: results.map(item => item.title)
    },
    ])

.then((answer) => {
    const roleChosen = results.find(item => item.title===answer.role_id)
    const employeeFirstName = answer.employeeAdd;
    const employeeLastName = answer.last_name;
        connection.query("SELECT * FROM employee", function (err, results){
        if (err) throw err;
        inquirer
        .prompt([{
    name: `manager_id`,
    type: `list`,
    message: `Select the Manager for this employee.`,
    choices: results.map(item => item.first_name)
    }
    ])
    .then((answer) => {
         const managerChosen = results.find(item => item.first_name===answer.manager_id)

        connection.query(
          "INSERT INTO employee SET ?", {
            first_name: employeeFirstName,
            last_name: employeeLastName,
            role_id: roleChosen.id,
            manager_id: managerChosen.id
          },
          function (err) {
              if (err) throw err;
              console.log("Added " + employeeFirstName + " " + employeeLastName + " to the team!");
            whatWouldYouLike();
          }  
        )
    })
    })
    })
    })
    }

// function for modifying an employee.
const employeeModifyRole = () => {
    connection.query("SELECT * FROM employee", function (err, results){
    if (err) throw err;
    inquirer
    .prompt([{
        name: `employeeUpdate`,
        type: `list`,
        message: `Choose the employee you would like to modify.`,
        choices: results.map(item => item.first_name)
        },
    ])

.then((answer) => {
    const updateEmployee = (answer.employeeUpdate)
    connection.query("SELECT * FROM role", function (err, results){
        if (err) throw err;
        inquirer
        .prompt([
    {
    name: `role_id`,
    type: `list`,
    message: `Select the new role of the employee.`,
    choices: results.map(item => item.title)
    },

    // {
    // name: `manager_id`,
    // type: `list`,
    // message: `Enter the manager id.`,
    // choices: results.map(item => item.first_name)
    // }

])
    .then((answer) => {
        const roleChosen = results.find(item => item.title===answer.role_id)
        // const managerChosen = results.find(item => item.first_name===answer.employee_id)

        connection.query(
          "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
            role_id: "" + roleChosen.id + "",
            // manager_id: managerChosen.id
          },
          function (err) {
              if (err) throw err;
              console.log("Updated " + updateEmployee + "'s role!");
            whatWouldYouLike();
          }  
        )
    })
    })
    })
    })
}


// function for viewing departments in the terminal.
            const departmentView = () => {
                connection.query("SELECT * FROM department", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })
            }


// function for viewing roles in the terminal.
            const roleView = () => {
                connection.query("SELECT * FROM role", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })
            }


// function for viewing employees in the terminal.
            const employeeView = () => {
                connection.query("SELECT * FROM employee", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })
            }






}