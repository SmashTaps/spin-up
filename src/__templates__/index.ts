import * as cdk from "@aws-cdk/core";
import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apig from "@aws-cdk/aws-apigateway";
import * as path from "path";
import { DevEnv } from "../types";
import { getSettings } from "./settings";

export interface {{stackNameCap}}Props extends cdk.NestedStackProps {
  readonly devEnv: DevEnv;
  readonly appName: string;
}

export default class {{stackNameCap}} extends cdk.NestedStack {
  public readonly table: dynamo.Table;

  constructor(scope: cdk.Construct, id: string, props: {{stackNameCap}}Props) {
    super(scope, id, props);

    const settings = getSettings(props.devEnv);

    this.table = new dynamo.Table(this, `${props.appName}-{{stackName}}`, {
      ...settings.dynamoDBTable,
    });


    {{apigatewayConstructCode}}
    {{getConstructCode}}
    {{postConstructCode}}
  }
}
