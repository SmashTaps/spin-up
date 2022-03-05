const __code__ = `
  // Get handler settings
  getHandlerSettings: {
    runtime: lambda.Runtime.{{nodeJsRunTime}},
    handler: "index.handler",
    code: lambda.Code.fromAsset(path.join(__dirname, "./lambdaFns/get"), {
      exclude: ["*.ts"],
    }),
  },

`;

export default __code__;
