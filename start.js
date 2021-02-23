var inquirer = require('inquirer')


const db = require( './app/connection' )('employee_db','rootroot')



async function showResult(){

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

console.log(`Result =`, result)

}

showResult()