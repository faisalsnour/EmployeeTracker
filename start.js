var inquirer = require('inquirer')

const db = require( './app/connection' )('employee_db','rootroot')

// function that return all employees
async function viewAllEmployee(){

 let result;

result = await db.query(`select E.empID as ID, E.firstName as First_Name, E.lastName as Last_Name, R.title as Title, D.name as Department , R.salary as Salary ,concat(M.firstName, ' ', M.lastName) as Manager 
from tblEmployee as E 
left join tblEmployee as M 
on E.ManagerID = M.empID
left join tblRole as R
on E.roleID =  R.roleID 
left join tblDepartment as D
on R.departmentID = D.depID;`)

console.log(result)
main()

}

// function to display all employee by department 
async function selectDisplayDepartment(){

let allDepartments = []
let test = await db.query("select name from tblDepartment;")
for(i=0; i<test.length;i++){
   allDepartments.push(test[i].name)
}
    const department = await inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "Select a department",
            choices: allDepartments,
        }
    ])

    let employeesByDepartment 

    employeesByDepartment = await db.query(`select E.empID as ID, E.firstName as First_Name, E.lastName as Last_Name, R.title as Title, D.name as Department , R.salary as Salary ,concat(M.firstName, ' ', M.lastName) as Manager 
    from tblEmployee as E 
    left join tblEmployee as M 
    on E.ManagerID = M.empID
    left join tblRole as R
    on E.roleID =  R.roleID 
    left join tblDepartment as D
    on R.departmentID = D.depID where D.name = "${department.options}"; `)
    console.log(employeesByDepartment);
    main()
}

// function that display all employees by role
async function selectDisplayRole(){
    let allRoles = []
    let test = await db.query("select title from tblRole;")
    for(i=0; i<test.length;i++){
        allRoles.push(test[i].title)
    }
        const role = await inquirer.prompt([
            {
                name: "options",
                type: "list",
                message: "Select a role",
                choices: allRoles,
            }
        ])

    let employeesByRole

    employeesByRole = await db.query(`select E.empID as ID, E.firstName as First_Name, E.lastName as Last_Name, R.title as Title, D.name as Department , R.salary as Salary ,concat(M.firstName, ' ', M.lastName) as Manager 
    from tblEmployee as E 
    left join tblEmployee as M 
    on E.ManagerID = M.empID
    left join tblRole as R
    on E.roleID =  R.roleID 
    left join tblDepartment as D
    on R.departmentID = D.depID where R.title = "${role.options}"; `)
    console.log(employeesByRole)
    main()
}

// function to display all employees by selecting a manager
async function selectDisplayManager(){

    let allEmployeesByManager = []
    let test = await db.query(`select concat(E.firstName, ' ', E.lastName) as name from tblEmployee as E inner join tblRole  as R on E.roleID = R.roleID  where R.title like '%manager%';
    `)
    for(i=0; i<test.length;i++){
        allEmployeesByManager.push(test[i].name)
    }
        const manager = await inquirer.prompt([
            {
                name: "options",
                type: "list",
                message: "Select a Manager name",
                choices: allEmployeesByManager,
            }
        ])

    let employeesByManager

    employeesByManager = await db.query(`select E.empID as ID, E.firstName as First_Name, E.lastName as Last_Name, R.title as Title, D.name as Department , R.salary as Salary ,concat(M.firstName, ' ', M.lastName) as Manager 
    from tblEmployee as E 
    left join tblEmployee as M 
    on E.ManagerID = M.empID
    left join tblRole as R
    on E.roleID =  R.roleID 
    left join tblDepartment as D
    on R.departmentID = D.depID where concat(M.firstName, ' ', M.lastName) = "${manager.options}";`)
    console.log(employeesByManager)
    main()
}

// function to add new department
async function addDepartment(){
    const depName = await inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Enter the department name",
        }
    ])

    const data = [0,depName.department];
    let departmentName = await db.query("insert into tblDepartment values (?,?);",data)
    console.log("new department has been entered")
    main()
}

// function to add new role 
async function addRole(){

    let getDepartments = []
    let test = await db.query("select name from tblDepartment;")
    for(i=0; i<test.length;i++){
    getDepartments.push(test[i].name)
}

    const roleInfo = await inquirer.prompt([
        {
            name: "title",
            type:"input",
            message: "Enter the role title"
        },
        {
            name: "salary",
            type: "number",
            message: "Enter the annual salary"
        },
        {
            name: "department",
            type: "list",
            message: "Choose department",
            choices: getDepartments
        }
    ])

    let depID = []
    depID = await db.query(`select depID from tblDepartment where name = "${roleInfo.department}";`)
    let roleData = [0,roleInfo.title, roleInfo.salary, depID[0].depID]
    await db.query("insert into tblRole values (?,?,?,?)",roleData);
    console.log("A new role has entered")
    main()
}

// function to add new employee
async function addEmployee(){

    let roleID;
    let managerID;
    let getRolesTitle = []
    let getRoles = []
    let role = await db.query("select roleID, title from tblRole;")
    for(i=0; i<role.length;i++){
    getRolesTitle.push(role[i].title)
    getRoles.push(role[i])
    }

    let getManagersName = []
    let getManagers = []
    let managerResult = await db.query(`select empID, concat(E.firstName, ' ', E.lastName) 
    as Name from tblEmployee as E inner join tblRole  as R on E.roleID = R.roleID  
    where R.title like '%manager%';
    `)
    for(j=0; j<managerResult.length;j++){
        getManagersName.push(managerResult[j].Name)
        getManagers.push(managerResult[j])
    }

    const employeeInfo = await inquirer.prompt([
        {
            name: "firstName",
            type:"input",
            message: "Enter employee first name"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter employee last name"
        },
        {
            name: "title",
            type: "list",
            message: "Choose role title",
            choices: getRolesTitle
        },
        {
            name: "manager",
            type: "list",
            message: "Assign Manager",
            choices: getManagersName
        }
    ])
    for(y=0; y<getRoles.length; y++){
    if(getRoles[y].title === employeeInfo.title){
        roleID = getRoles[y].roleID
        }
    }
    for(x=0; x<getManagers.length; x++){
        if(getManagers[x].Name === employeeInfo.manager ){
            managerID = getManagers[x].empID
        }
    }
    
    employeeData = [0,employeeInfo.firstName, employeeInfo.lastName, roleID, managerID]
    await db.query("insert into tblEmployee values (?,?,?,?,?)", employeeData )

    console.log("new employee has been entered")

    main()

}
// function to update an existing employee's role 
async function updateEmployeeRole(){

    let getEmployees = []
    let getEmployeesName = []

    let employee = await db.query(`select empID, concat(firstName, ' ', lastName) as name 
    from tblEmployee;`)
    for(b=0; b<employee.length;b++){
    getEmployeesName.push(employee[b].name)
    getEmployees.push(employee[b])
    }

    let getAllRoles = []
    let getRolesName = []
    let getRoles = await db.query("select roleID, title from tblRole;")
    for(x=0; x<getRoles.length;x++){
    getRolesName.push(getRoles[x].title)
    getAllRoles.push(getRoles[x])
    }


    const employeeUpdateRole = await inquirer.prompt([
        {
            name: "employee",
            type: "list",
            message: "Select an employee",
            choices: getEmployeesName
        },
        {
            name: "newRole",
            type: "list",
            message: "Select new role",
            choices: getRolesName
        }
    ])

    let targetedEmployeeID;

    for(h=0; h<getEmployees.length; h++){
        if(employeeUpdateRole.employee === getEmployees[h].name){
            targetedEmployeeID = getEmployees[h].empID
        }
    }

    let updatedRoleID;

    for(k=0; k<getAllRoles.length; k++){
        if(employeeUpdateRole.newRole === getAllRoles[k].title){
            updatedRoleID = getAllRoles[k].roleID
        }
    }
    
    await db.query(`update tblEmployee set roleID = ${updatedRoleID} where empID = ${targetedEmployeeID};`)
    console.log("Employee role has been updated")
    main()
}

// function that executes immediately after running the application 
async function main(){
    const response = await inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "what would you like to do?",
            choices: ["Add Department","Add Role","Add Employee","Update Employee Role","View All Employees","View All Employees By Department", "View All Employees By Role","View All Employees By Manager"]
        }
    ])
    
    if(response.options === "Add Department"){
        addDepartment()
    }
    if(response.options ==="Add Role"){
        addRole()
    }
    if(response.options ==="Add Employee"){
        addEmployee()
    }
    if(response.options ==="Update Employee Role"){
        updateEmployeeRole()
    }
    if(response.options === "View All Employees"){
        viewAllEmployee();
    }

    if(response.options === "View All Employees By Department"){
        selectDisplayDepartment();
    }
    if(response.options ==="View All Employees By Role"){
        selectDisplayRole();   
    }
    if(response.options ==="View All Employees By Manager"){
        selectDisplayManager()
    }
}
main()
