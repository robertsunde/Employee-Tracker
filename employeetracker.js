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
                `View Employees of Selected Manager`,
                `View Budget of Selected Department`,
                `Update Employee's Role`,
                `Update Employee's Manager`,
                `Remove Department`,
                `Remove Role`,
                `Remove Employee`,
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

                case `Remove Employee`:
                employeeDelete();
                break;

                case `Remove Role`:
                roleDelete();
                break;

                case `Remove Department`:
                departmentDelete();
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

                case `View Employees of Selected Manager`:
                employeeManagerView();
                break;

                case `View Budget of Selected Department`:
                departmentBudgetView();
                break;

                case `Update Employee's Role`:
                employeeModifyRole();
                break;

                case `Update Employee's Manager`:
                employeeModifyManager();
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

// function for modifying an employee's role.
const employeeModifyRole = () => {
    connection.query("SELECT * FROM employee", function (err, results){
    if (err) throw err;
    inquirer
    .prompt([{
        name: `employeeUpdate`,
        type: `list`,
        message: `Choose the employee whose role you would like to update.`,
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
])
    .then((answer) => {
        const roleChosen = results.find(item => item.title===answer.role_id)

        connection.query(
          "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
            role_id: "" + roleChosen.id + "",
          },
          function (err) {
              if (err) throw err;
              console.log("Successfully updated " + updateEmployee + "'s role to " + answer.role_id + "!");
            whatWouldYouLike();
          }  
        )
    })
    })
    })
    })
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function for modifying an employee's role.
const employeeModifyManager = () => {
    connection.query("SELECT * FROM employee", function (err, results){
    if (err) throw err;
    inquirer
    .prompt([{
        name: `employeeUpdateManager`,
        type: `list`,
        message: `Please select the employee whom will be reporting to a different manager.`,
        choices: results.map(item => item.first_name)
        },
    ])

.then((answer) => {
    const updateEmployeeManager = (answer.employeeUpdateManager)
    connection.query("SELECT * FROM employee", function (err, results){
        if (err) throw err;
        inquirer
        .prompt([
    {
    name: `manager_id`,
    type: `list`,
    message: `Please select the new manager of this employee.`,
    choices: results.map(item => item.first_name)
    },
])
    .then((answer) => {
        const managerChosenUpdated = results.find(item => item.first_name===answer.manager_id)

        connection.query(
          "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployeeManager + "'", {
            manager_id: "" + managerChosenUpdated.id + "",
          },
          function (err) {
              if (err) throw err;
              console.log("Successfully updated " + updateEmployeeManager + "'s manager to" + " " + answer.manager_id + "!");
            whatWouldYouLike();
          }  
        )
    })
    })
    })
    })
}
// /////////////////////////////////////////////////////////////////////////////////////////////////

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

// function for viewing employees by their manager in the terminal.
            const employeeManagerView = () => {
                connection.query("SELECT * FROM employee", function (err, results){
                    if(err) throw err;
                    inquirer
                    .prompt([{
                    name: `managersTeam`,
                    type: `list`,
                    message: `Please choose the manager whose team you would like to view.`,
                    choices: results.map(item => item.first_name)
                    },
                ])
              .then((answer) => {
                const managersName = results.find(item => item.first_name===answer.managersTeam)
                const managersID = managersName.id
                connection.query("SELECT * FROM employee WHERE manager_id = " + "'" + managersID + "'", (err, res) => {
                if (err) throw err;
                console.table(res)
                whatWouldYouLike()
                })
              })
              })   
            }

// function for removing a selected employee.
            const employeeDelete = () => {
                connection.query("SELECT * FROM employee", function (err, results){
                    if(err) throw err;
                    inquirer
                    .prompt([{
                    name: `employeeDeleteName`,
                    type: `list`,
                    message: `Please select the employee that you would like to remove.`,
                    choices: results.map(item => item.first_name)
                    },
                ])
              .then((answer) => {
                const employeeRemove1 = results.find(item => item.first_name===answer.employeeDeleteName)
                const employeeRemove2 = employeeRemove1.id
                connection.query(
                "DELETE FROM employee WHERE id = " + "'" + employeeRemove2 + "'",
                function (err) {
                if (err) throw err;
                console.log("Successfully removed " + answer.employeeDeleteName + " from the database!");
                whatWouldYouLike();
                    }  
                )
                })
              })   
            }

// function for removing a selected role.
            const roleDelete = () => {
                connection.query("SELECT * FROM role", function (err, results){
                    if(err) throw err;
                    inquirer
                    .prompt([{
                    name: `roleDeleteName`,
                    type: `list`,
                    message: `Please select the role that you would like to remove.`,
                    choices: results.map(item => item.title)
                    },
                ])
              .then((answer) => {
                const roleRemove1 = results.find(item => item.title===answer.roleDeleteName)
                const roleRemove2 = roleRemove1.id
                connection.query(
                "DELETE FROM role WHERE id = " + "'" + roleRemove2 + "'",
                function (err) {
                if (err) throw err;
                console.log("Successfully removed " + answer.roleDeleteName + " from the available roles!");
                whatWouldYouLike();
                    }  
                )
                })
              })   
            }

// function for removing a selected department.
            const departmentDelete = () => {
                connection.query("SELECT * FROM department", function (err, results){
                    if(err) throw err;
                    inquirer
                    .prompt([{
                    name: `departmentDeleteName`,
                    type: `list`,
                    message: `Please select the department that you would like to remove.`,
                    choices: results.map(item => item.name)
                    },
                ])
              .then((answer) => {
                const departmentRemove1 = results.find(item => item.name===answer.departmentDeleteName)
                const departmentRemove2 = departmentRemove1.id
                connection.query(
                "DELETE FROM department WHERE id = " + "'" + departmentRemove2 + "'",
                function (err) {
                if (err) throw err;
                console.log("Successfully removed " + answer.departmentDeleteName + " from the available departments!");
                whatWouldYouLike();
                    }  
                )
                })
              })   
            }



// function for viewing the total utilized budget of a selected department.
const departmentBudgetView = () => {
    connection.query("SELECT * FROM department", function (err, results){
        if(err) throw err;
        inquirer
        .prompt([{
        name: `departmentForBudget`,
        type: `list`,
        message: `Please select a department to view its budget.`,
        choices: results.map(item => item.name)
        },
    ])
  .then((answer) => {
    const departmentForBudget1 = results.find(item => item.name===answer.departmentForBudget)
    const departmentForBudget2 = departmentForBudget1.id
    connection.query("SELECT SUM(salary) as Total_Department_Budget FROM role WHERE department_id = " + "'" + departmentForBudget2 + "'", (err, res) => {
    if (err) throw err;
    console.table(res)
    whatWouldYouLike()
    })
  })



  






// ////////////////////////////////////////////////////
}




// //////////////////////////////////////////////////////////
    )}} 
