const __postConstructCode__ = `
const createLambda = new lambda.Function(
  this,
  \`otterzCreate{{stackNameCap}}Lambda\${props.appName}Lambda\`,
  {
    ...getSettings("dev", props.appName).createHandlerSettings,
    code: lambda.Code.fromAsset(
      path.join(__dirname, "./lambdaFns/create"),
      {
        exclude: ["*.ts"],
      }
    ),
    environment: {
      dynamoDbTableName: this.table.tableName,
    },
  }
);

this.table.grantWriteData(createLambda);



const createLambdaIntegration = new apig.LambdaIntegration(createLambda);

apigw.root.addMethod("POST", createLambdaIntegration);
`;

export default __postConstructCode__;
