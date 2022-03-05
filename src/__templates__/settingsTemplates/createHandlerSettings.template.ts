// POST handler

const __code__ = `
  createHandlerSettings: {
    runtime: lambda.Runtime.{{nodeJsRunTime}},
    handler: "index.handler",
    code: lambda.Code.fromAsset(
      path.join(__dirname, "./lambdaFns/create"),
      {
        exclude: ["*.ts"],
      }
    ),
  },
  
`;

export default __code__;
