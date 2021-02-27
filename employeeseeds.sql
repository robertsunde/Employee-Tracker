USE employee_tracker_db;

INSERT INTO department (name)
VALUES 
("Assembly"),
("Benching"),
("Machining"),
("EDM"),
("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES 
("Manager", 80000, 1),
("Assistant Manager", 70000, 2),
("Team Leader", 60000, 3),
("Engineer", 50000, 4),
("Designer", 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Robert", "Sunde", 1, 1),
("Joe", "Smith", 2, null),
("Bill", "Alsosmith", 3, 3),
("Dave", "Williams", 4, null),
("Andy", "Black", 5, 5);


