USE employeeDB;

INSERT INTO departments (name) 
VALUES ('Sales'),('Engineering');

INSERT INTO roles (title,salary,department_id)
VALUES ('Salesperson',40000,1),('Software Developer',75000,2),('Sales Manager',85000,1),('Engineering Manager',90000,2);

INSERT INTO employees (first_name,last_name,role_id)
VALUES ('Joe','Schmoe',3);

INSERT INTO employees (first_name,last_name,role_id)
VALUES ('John','Smith',4);

INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ('Dan','Henderson',1,1),('Steve','Krasinski',2,2);

