const __code__ = `
  const apigw = new apig.RestApi(
    this,
    \`{{stackName}}RestApi-\${props.appName}\`,
    {
      ...settings.apigwSetting,
    }
  );
`;

export default __code__;
