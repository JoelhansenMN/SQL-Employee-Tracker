SELECT * FROM department;

SELECT roles.roles_id, roles.title, department.name, roles.salary
FROM roles
JOIN department ON roles.department_id = department.id;

SELECT