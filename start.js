var inquirer = require('inquirer')


const db = require( './app/connection' )('employee_db','rootroot')



async function viewAllEmployee(){

 let result;
//  result =  await db.query("select * from tblEmployee;");
//  console.log(result);

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


async function main(){
    const response = await inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "what would you like to do?",
            choices: ["View All Employees","View All Employees By Department", "View All Employees By Manager"]
        }
    ])

    if(response.options === "View All Employees"){
        viewAllEmployee();
    }

    if(response.options === "View All Employees By Department"){
        selectDisplayDepartment();
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