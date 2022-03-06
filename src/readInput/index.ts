import inquirer from "inquirer";

async function readInputs() {
  const data = await inquirer.prompt([
    {
      type: "input",
      name: "nestedStackName",
      message: "Nested Stack Name: ",
      default: "myStack",
    },
    {
      type: "checkbox",
      name: "apiEndPoints",
      message: "Add endpoints: ",
      choices: ["GET", "POST"],
    },
    {
      type: "input",
      name: "dbTableName",
      message: "DynamoDB table name",
      default: "myTable",
    },
    {
      type: "list",
      name: "dbBillingMode",
      message: "Select DynamoDB table billing mode",
      choices: ["PAY_PER_REQUEST", "PROVISIONED"],
      default: "PAY_PER_REQUEST",
    },
    {
      type: "list",
      name: "dbRemovalPolicy",
      message: "Select DynamoDB table removal policy",
      choices: ["DESTROY", "RETAIN"],
      default: "DESTROY",
    },
    {
      type: "rawlist",
      name: "nodeJsRunTime",
      message: "Select NodeJS runtime.",
      choices: ["NODEJS_12_X", "NODEJS_14_X", "NODEJS_16_X"],
      default: "NODEJS_14_X",
    },
    {
      type: "input",
      name: "apiName",
      message: "Enter the API name.",
      default: "my-api",
    },
    {
      type: "input",
      name: "nestedStackPath",
      message: "Path to save nested stack",
      default: "lib/MyStack",
    },
    {
      type: "rawlist",
      message: "How do you feel today?",
      name: "howDoYouFeel",
      choices: [
        "Bro!! Seriously??? ******* 😡",
        "good",
        "bad",
        "lonely",
        "sexy",
        "Not giving up",
        "Its fridayYYY!!!!",
      ],
      default: "Bro!!! Seriously??? ******* 😡",
    },
  ]);
  return data;
}

export default readInputs;
