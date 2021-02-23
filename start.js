var inquirer = require('inquirer')


const db = require( './app/connection' )('employee_db','rootroot')



async function showResult(){

 let result;
 result =  await db.query("select * from tblEmployee;");
 console.log(result);
}

showResult()