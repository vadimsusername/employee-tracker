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
function updateRole(role,newSalary){
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
      console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      connection.end();
    }
  );
}
function getEmployee(fname,lname){
  var name;
  var role_id;
  var manager_id;
  connection.query(
      `SELECT e.first_name AS First,e.last_name AS Last,roles.title,roles.salary,d.name,m.first_name AS ManagerFirst,m.last_name AS Managerlast FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments AS d ON roles.department_id = d.id  WHERE e.first_name = "${fname}" AND e.last_name = "${lname}"`,
      function(err, res) {
          if (err) throw err;
          console.log(res);
          connection.end();
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
          connection.end();
      }
  );
}
function getDepartments(){
    connection.query(
        "SELECT * from departments",
        function(err, res) {
            if (err) throw err;
            console.log(res);
            connection.end();
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
            connection.end();
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
                connection.end();
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
        connection.end();
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




