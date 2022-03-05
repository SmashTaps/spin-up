import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import { v4 as uuid } from "uuid";
import { generateResponse } from "@smashtaps/lambda-utils";
import * as AWS from "aws-sdk";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  if (!process.env.dynamoDbTableName) {
    return callback(
      null,
      generateResponse("internalServerError", {
        created: false,
        message: "Invalid DB Operation",
      })
    );
  }

  if (!event.queryStringParameters) {
    return callback(
      null,
      generateResponse("badRequest", {
        created: false,
        message: "Missing parameters",
      })
    );
  }

  const tenantId = event.queryStringParameters.tenantId;

  const params = {
    TableName: process.env.dynamoDbTableName,
    Key: {
      id: tenantId,
    },
    UpdateExpression: `Set active = :active`,
    ExpressionAttributeValues: {
      ":active": false,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    await dynamoDb.update(params).promise();

    return callback(
      null,
      generateResponse(
        "updated",
        {
          deactivated: true,
        },
        true
      )
    );
  } catch (error) {
    console.error(error);
    return callback(
      null,
      generateResponse("internalServerError", {
        error,
      })
    );
  }
}
