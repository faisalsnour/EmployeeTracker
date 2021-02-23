var inquirer = require('inquirer')


const db = require( './app/connection' )('employee_db','rootroot')



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

async function main(){
    const response = await inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "what would you like to do?",
            choices: ["Add Department","View All Employees","View All Employees By Department", "View All Employees By Role","View All Employees By Manager"]
        }
    ])
    
    if(response.options === "Add Department"){
        addDepartment()
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

async function test(){
let allDepartments = []
let test = await db.query("select name from tblDepartment;")
for(i=0; i<test.length;i++){
   allDepartments.push(test[i].name)
}
console.log(allDepartments)
}
main()
// test()