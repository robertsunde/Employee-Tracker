const mysql = require(`mysql`);
const inquirer = require(`inquirer`);

const connection = mysql.createConnection({

//  default port if not specified.
port: 3306,

// database user.
user: `root`,

// database password.
password: `yourRootPassword`,
database: `empoloyee_tracker_db`,
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
        }])

        .then((answer) => {
            switch (amswer.action) {
                case `Add Department`:
                departmentAdd();
                break;

                case `Add Role`:
                roleAdd();
                break;

                case `View Department`:
                departmentView();
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
                  console.log("Added" + answers.departmentAdd + "Department");
                whatWouldYouLike();
              }  
            )
        })

        }


        const roleAdd = () => {
            inquirer
            .prompt([{
                name: `roleAdd`,
                type: `input`,
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

            {
            name: `department_id`,
            type: `list`,
            message: `Enter the department id of this role.`,
            choices: res.map(item => item.name)
            },

        ])
            .then((answer) => {
                const departmentChosen = res.find(item => item.name===answers.department_id)



                connection.query(
                  "INSERT INTO role SET ?", {
                    title: answer.roleAdd,
                    salary: answer.salary,
                    department_id: departmentChosen.id
                  },
                  function (err) {
                      if (err) throw err;
                      console.log("Added" + answers.roleAdd + "Role");
                    whatWouldYouLike();
                  }  
                )
            })
    
            }



            const departmentView = () => {
                connection.query("SELECT * FROM department", (err, res) => {
                    if(err) throw err;
                    console.table(res)
                    whatWouldYouLike();
                })



            }






}