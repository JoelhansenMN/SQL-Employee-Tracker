SELECT * FROM department;

SELECT roles.id, roles.title, department.name AS department, roles.salary
FROM roles
JOIN department ON roles.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
FROM employee
LEFT JOIN roles ON employee.roles_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;