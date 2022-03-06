const __getConstructCode__ = `

const getLambda = new lambda.Function(
  this,
  \`otterzGet{{stackNameCap}}Lambda\${props.appName}Lambda\`,
  {
    ...getSettings("dev", props.appName).getHandlerSettings,

    code: lambda.Code.fromAsset(
      path.join(__dirname, "./lambdaFns/get"),
      {
        exclude: ["*.ts"],
      }
    ),
    environment: {
      dynamoDbTableName: this.table.tableName,
    },
  }
);

this.table.grantReadData(getLambda);

const getLambdaIntegration = new apig.LambdaIntegration(getLambda);

apigw.root.addMethod("GET", getLambdaIntegration);

`;

export default __getConstructCode__;
