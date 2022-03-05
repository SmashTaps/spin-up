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
        message: process.env.dynamoDbTableName,
      })
    );
  }

  const params = {
    TableName: process.env.dynamoDbTableName,
    Item: {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    },
  };

  try {
    const item = await dynamoDb.put(params).promise();

    return callback(
      null,
      generateResponse(
        "created",
        {
          created: true,
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
