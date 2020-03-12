var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Tim1pwfmysql",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
 
  connection.end();
});
function updateRoleSalary(role,newSalary){
  connection.query(
    "UPDATE roles SET ? WHERE ?",
    [
      {
        salary: newSalary
      },
      {
        title: role
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " role updated!\n");
      showMainMenu();
    }
  );
}
function updateRoleTitle(role,newTitle){
  connection.query(
    "UPDATE roles SET ? WHERE ?",
    [
      {
        title: newTitle
      },
      {
        title: role
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " role updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      showMainMenu();
    }
  );
}
function updateRoleDepartment(role,department){
  connection.query(`SELECT id FROM departments WHERE ?`,
      {
        name: department
      },
      function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        let newId = res[0].id;
        connection.query(
          "UPDATE roles SET ? WHERE ?",
          [
            {
              department_id: newId
            },
            {
              title: role
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " role updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            showMainMenu();
          }
        );
     
      }
    );
  
}
function getRole(role){
  console.log("In getRole");
  connection.query(
    `SELECT roles.title,roles.salary,departments.name FROM roles JOIN departments on roles.department_id = departments.id WHERE roles.title = ?`,[role],
    function(err, res) {
        if (err) throw err;
        console.log(res);
        showMainMenu();
    }
  );
}
function getEmployee(fname,lname){

  connection.query(
      `SELECT e.first_name AS First,e.last_name AS Last,roles.title,roles.salary,d.name,m.first_name AS ManagerFirst,m.last_name AS Managerlast FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments AS d ON roles.department_id = d.id  WHERE e.first_name = "${fname}" AND e.last_name = "${lname}"`,
      function(err, res) {
          if (err) throw err;
          console.log(res);
          showMainMenu();
      }
  );
}
function getEmployees(){
  connection.query(
      "SELECT e.first_name AS First,e.last_name AS Last,roles.title,roles.salary,d.name,m.first_name AS ManagerFirst,m.last_name AS Managerlast FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments AS d ON roles.department_id = d.id  ",
  function(err, res) {
          if (err) throw err;
          console.log(res);
          //connection.end();
          showMainMenu();
      }
  );
}
function getRoles(){
  connection.query(
      "SELECT roles.title,roles.salary,departments.name  FROM roles JOIN departments on roles.department_id = departments.id",
      function(err, res) {
          if (err) throw err;
          console.log(res);
          showMainMenu();
      }
  );
}
function getDepartments(){
    connection.query(
        "SELECT * from departments",
        function(err, res) {
            if (err) throw err;
            console.log(res);
            showMainMenu();
        }
    );
}
function addDepartment(department){
    connection.query(
        "INSERT INTO departments SET ?",
        {
            name: department
        
        },
        function(err, res) {
            if (err) throw err;
            console.log(res);
            showMainMenu();
        }
    );
}
function addRole(title,salary,department){
    var dept_id;
    connection.query(`SELECT id FROM departments WHERE ?`,
      {
        name: department
      },
      function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.log(`First query, department id is : ${res[0].id}`);
        dept_id = res[0].id;
        console.log("Inserting a new employee...\n");
        connection.query(
            "INSERT INTO roles SET ?",
            {
                title: title,
                salary: salary,
                department_id: dept_id,
            },
            function(err, res) {
                if (err) throw err;
                console.log(res);
                showMainMenu();
            }
        );
      }
    );
}
function addEmployeeHelper(first,last,role,manager){

    console.log("Inserting a new employee...\n");
    var query = connection.query(
      "INSERT INTO employees SET ?",
      {
        first_name: first,
        last_name: last,
        role_id: role,
        manager_id: manager
      },
      function(err, res) {
        if (err) throw err;
        console.log(res);
        showMainMenu();
      }
    );
}

function addEmployee(fname,lname,role,manager){
    var manager_fname = manager.split(" ")[0];
    var manager_lname = manager.split(" ")[1];
    var manager_id;
    var role_id;
    connection.query(`SELECT id FROM employees WHERE ? AND ?`,
      [{
        first_name: manager_fname
      },
      {
        last_name: manager_lname
      }],
      function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        console.log(`First query, manager id is: ${res[0].id}`);
        
        //return res[0].id;
        manager_id = res[0].id;
       
        //return res[0].id;
        connection.query(`SELECT id FROM roles WHERE ?`,
            {
                title: role
            },
            function(err, res) {
                if (err) throw err;
                // Log all results of the SELECT statement
                console.log(res[0].id);
                console.log(`Second query, manager id is: ${manager_id} role id is : ${res[0].id}`);            
                role_id = res[0].id;
                addEmployeeHelper(fname,lname,role_id,manager_id);
                //connection.end();
            }
        );
    
      }
    );

}
function addEmployeePrompt(){
  connection.query(
    "SELECT first_name,last_name FROM employees",
    function(err, res) {
      if (err) throw err;
      console.log("in add employee");
      console.log(res);     
      let employees = res.map(row => `${row.first_name} ${row.last_name}`);
      console.log(employees);
      connection.query(
        `SELECT title FROM roles`,
        function(err, res) {
          if (err) throw err;
          console.log("in add employee, get roles");
          console.log(employees);
          console.log(res);
          let roles = res.map(row => row.title);
          console.log(roles);
          inquirer.prompt([
            {
              type: "input",
              message: "Enter First Name",
              name: "firstname"
            },
            {
              type: "input",
              message: "Enter Last Name",
              name: "lastname"
            },
            {
              type: "list",
              message: "Choose Role",
              choices: roles,
              name: "role"
            },
            {
              type: "list",
              message: "Choose Manager",
              choices: employees,
              name: "manager"
            }
          ]).then(answers =>{
             console.log(answers);
             addEmployee(answers.firstname,answers.lastname,answers.role,answers.manager);
          });
        }
      );
    
    }
  );
}
function addDepartmentPrompt(){
  inquirer.prompt({
    type:"input",
    message:"Enter the Name of the New Department",
    name: "department"
  }).then(answer => addDepartment(answer.department));
}
function updateRolePrompt(){
  
  connection.query(
    "SELECT title FROM roles",
    function(err,res) {
      if(err) throw err;
      console.log("in choose role");
      console.log(res);
      let roles = res.map(row => row.title);
      console.log(roles);

      inquirer.prompt(
        {
          type: "list",
          message: "Choose a Role to Update:",
          choices: roles,
          name: "role"
        },

      ).then(answer => {
          console.log(answer.role);
          let updateRole = answer.role;
          inquirer.prompt({
            type:"list",
            message: "What would you like to change?",
            choices:["Change Title","Change Salary","Change Department"],
            name: "choice"
          }).then(answer => {
              switch (answer.choice){
                case "Change Title":
                  inquirer.prompt({
                    type: "input",
                    message: "Enter New Title",
                    name: "title"
                  }).then(answer => updateRoleTitle(updateRole,answer.title));
                  break;
                case "Change Salary":
                  inquirer.prompt({
                    type: "input",
                    message: "Enter New Salary",
                    name: "salary"
                  }).then(answer => updateRoleSalary(updateRole,answer.salary));
                  break;
                case "Change Department":
                  connection.query(
                    "SELECT * from departments",
                    function(err, res) {
                        if (err) throw err;
                        console.log(res);
                        let departments = res.map(row => row.name);
                        inquirer.prompt({
                          type:"list",
                          message:"Choose new Department:",
                          choices: departments,
                          name:"department"
                        }).then(answer => {
                          updateRoleDepartment(updateRole,answer.department);
                        });
                        
                    }
                  );

              }
          });
      });
    }
  );
}
function addRolePrompt(){
  connection.query(
      `SELECT name FROM departments`,   
      function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("in add role prompt, get departments")
        console.log(res);
        let departments = res.map(row => row.name);
       
        console.log(departments);
        
        inquirer.prompt([{
            type: "input",
            message: "Enter the Title of the New Role:",
            name: "title"
          },
          {
            type: "input",
            message: "Enter the Salary:",
            name: "salary"
          },
          {
            type: "list",
            message: "Choose a Department",
            choices: departments,
            name: "department"
          }
        ]).then(answers => {
            console.log(answers);
            addRole(answers.title,answers.salary,answers.department);
        });
      }
    );    

}
function chooseRole(){
  connection.query(
    "SELECT title FROM roles",
    function(err,res) {
      if(err) throw err;
      console.log("in choose role");
      console.log(res);
      let roles = res.map(row => row.title);
      console.log(roles);

      inquirer.prompt(
        {
          type: "list",
          message: "Choose a Role",
          choices: roles,
          name: "role"
        }
      ).then(answer => {
          console.log(answer.role);
          getRole(answer.role);
      });
    }
  );
}
function chooseEmployee(){
  connection.query(
    "SELECT first_name,last_name FROM employees",
    function(err, res) {
      if (err) throw err;
      console.log("in chooseEmployee");
      console.log(res);     
      let employees = res.map(row => `${row.first_name} ${row.last_name}`);
     
      console.log(employees);
      
      inquirer.prompt({
        type: "list",
        message: "Choose Employee: ",
        choices: employees,
        name: "employee"
      }).then(answer =>{
        console.log("Choose employee response");
        console.log(answer.employee);
        let firstname = answer.employee.split(" ")[0];
        let lastname = answer.employee.split(" ")[1];
        getEmployee(firstname,lastname);
      });
      
   
    }
  );
}
var firstprompt = [
  {
    type: "list",
    message: "Choose an option: ",
    choices: ["View Employees","View Roles","View Departments","View an Employee","View a Role","Add an Employee","Add a Role","Add a Department","Update a Role"],
    name: "mainmenu"
  }
];

function showMainMenu(){
  inquirer.prompt(firstprompt).then(answers => {
    var choice = answers.mainmenu;
    switch(choice){
      case "View Employees":
        getEmployees();
        break;
      case "View Roles":
        getRoles();
        break;
      case "View Departments":
        getDepartments();
        break;
      case "View an Employee":
        chooseEmployee();
        break;
      case "View a Role":
        chooseRole();
        break;
      case "Add an Employee":
        addEmployeePrompt();
        break;
      case "Add a Role":
        addRolePrompt();
      case "Add a Department":
        addDepartmentPrompt();
        break;
      case "Update a Role":
        updateRolePrompt();
        break;  
    }
  });
}



