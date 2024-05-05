INSERT INTO department ("name")
  VALUES 
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("Sales");

INSERT INTO roles ("title, salary, department_id")
  VALUES 
    ("Sales Lead", 100000, 4),
    ("Salesperson", 80000, 4),
    ("Lead Engineer", 150000, 1),
    ("Software Engineer", 120000, 1),
    ("Account Manager", 160000, 2),
    ("Accountant", 125000, 2),
    ("Legal Team Lead", 250000, 3),
    ("Lawyer", 190000, 3);

INSERT INTO employee("first_name", "last_name", "roles_id", "manager_id")
  VALUES
    ("David", "Raya", 1, NULL),
    ("William", "Saliba", 2, 1),
    ("Martin", "Odegard", 3, NULL),
    ("Thomas", "Partey", 4, 3),
    ("Leandro", "Trossard", 5, NULL),
    ("Gabriel", "Jesus", 6, 5),
    ("Bukayo", "Saka", 7, NULL),
    ("Aaron", "Ramsdale", 8, 7);
