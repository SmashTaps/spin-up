import * as dynamo from "@aws-cdk/aws-dynamodb";
import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import { DevEnv } from "../types";

const settings = {
  // Dynamodb Table
  dynamoDBTable: {
    tableName: "{{dbTableName}}",
    billingMode: dynamo.BillingMode.{{dbBillingMode}},
    removalPolicy: core.RemovalPolicy.{{dbRemovalPolicy}},
    partitionKey: {
      name: "id",
      type: dynamo.AttributeType.STRING,
    },
  },

  {{createHandlerSettingsCode}}
  {{getHandlerSettingsCode}}

  // API gateway settings
  apigwSettings: {
    restApiName: "{{apiName}}",
  },
};

export function getSettings(env: DevEnv = "dev", appName: string) {
  return {
    ...settings,
    dynamoDBTable: {
      ...settings.dynamoDBTable,
      tableName: settings.dynamoDBTable.tableName + appName,
      removalPolicy:
        env === "dev" ? core.RemovalPolicy.DESTROY : core.RemovalPolicy.RETAIN,
    },
    createHandlerSettings: {
      ...settings.createHandlerSettings,
    },
    apigwSetting: {
      ...settings.apigwSettings,
      restApiName: settings.apigwSettings.restApiName + appName,
    },
    getHandlerSettings: {
      ...settings.getHandlerSettings,
    },
  };
}
