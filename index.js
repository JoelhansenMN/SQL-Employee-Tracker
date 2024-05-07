//definitions and Dependencies
const inquirer = require('inquirer');
const { Pool } = require('pg');
const table = require('console.table');


// Connect to database tracker_db
const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 'Bodenis8!',
    host: 'localhost',
    database: 'tracker_db'
  },
  console.log(`Connected to the tracker_db database.`)
)

// creates main menu prompt
const tracker = () => inquirer.prompt([
  {
    type: 'list',
    name: 'question',
    message: 'What would you like to do:',
    choices: ["Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "View All Employees", "Add Employee", "Quit"]
  }

])

  //itemized list in the main menu prompt
  .then((results) => {
    const { question } = results;

    switch (question) {
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Quit':
        pool.end();
        break;
    }

  });

//viewAllDepartments function which populate the table when selected.  
viewAllDepartments = () => {
  const sql = `SELECT * FROM department`
  pool.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results.rows)
    tracker();
  })
};

//viewAllRoles functions which populate the roles when selcted.
viewAllRoles = () => {
  const sql = `SELECT roles.id, 
  roles.title,
  department.name AS department, 
  roles.salary 

  FROM roles 

  JOIN department ON roles.department_id = department.id`
  pool.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results.rows)
    tracker();
  })
};

viewAllEmployees = () => {
  const sql = `SELECT employee.id, 
    employee.first_name, 

    employee.last_name, 

    roles.title, 

    department.name AS department, 

    roles.salary, 

    CONCAT(manager.first_name, ' ' , manager.last_name) AS manager 

    FROM employee

    LEFT JOIN roles ON employee.roles_id = roles.id

    LEFT JOIN department ON roles.department_id = department.id

    LEFT JOIN employee manager ON employee.manager_id = manager.id`
  pool.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results.rows)
    tracker();
  })
};


function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What department would you like to add?'
    },
  ])

    .then((results) => {
      const params = [results.department];
      const sql = `INSERT INTO department (name)
    VALUES ($1)`
      pool.query(sql, params, (err, results) => {
        if (err) throw err;
        console.log('added to db')
        tracker();
      })
    })
};

function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the role would you like to add?'
    },

    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for the role?'
    },
  ])
    .then((data) => {
      const params = [data.title, data.salary]
      const departmentSql = 'SELECT * FROM department'
      pool.query(departmentSql, (err, info) => {
        if (err) throw err;
        const departments = info.rows.map(({ id, name }) => ({ name: name, value: id }))

        inquirer.prompt([
          {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: departments
          },

        ]).then((answer) => {
          console.log(answer)
          console.log(data)
          const userData = {
            ...answer,
            ...data
          }
          console.log(userData)


          const params = [userData.title, userData.salary, userData.department];
          const sql = `INSERT INTO roles (title, salary, department_id)
    VALUES ($1, $2, $3)`
          pool.query(sql, params, (err, info) => {
            console.log('role added')
            tracker();
          })
        })
      })

    })

}

function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employee\'s first name?'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employee\'s last name?'
    },

  ])
    .then((data) => {
      const params = [data.firstName, data.lastName];
      const rolesSql = 'SELECT roles.id, roles.title FROM roles'
      pool.query(rolesSql, (err, info) => {
        if (err) throw err;
        const roles = info.rows.map(({ id, title }) => ({ name: title, value: id }))

        inquirer.prompt([
          {
            type: 'list',
            name: 'roles',
            message: 'What is the employees role?',
            choices: roles
          },
        ])
          .then((answer) => {
            console.log(answer)
            console.log(data)
            const userData = {
              ...answer,
              ...data
            }
            const params = [userData.firstName, userData.lastName, userData.roles];
            const managerSql = `SELECT * FROM employee`
            pool.query(managerSql, (err, info) => {
              if (err) throw err;
              const manager = info.rows.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }))

              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: 'Who is the employee\'s manager?',
                  choices: manager
                },
              ])
                .then((answer2) => {
                  console.log(answer2)
                  console.log(data)
                  const userData = {
                    ...answer2,
                    ...answer,
                    ...data
                  }
                  const params = [userData.firstName, userData.lastName, userData.roles, userData.manager];
                   const query = 'INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ($1, $2, $3, $4)';

                  console.log(userData)
                  pool.query(query, params, (err, res) => {
                    if (err) throw err;
                    console.log('Employee added successfully');
                    tracker();
                  });
                });
            })
          }

          )
      }

      )

    }

    )
}

function updateEmployeeRole(){

}

 




tracker();