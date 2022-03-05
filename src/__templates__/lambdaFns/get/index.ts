import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import { generateResponse } from "@smashtaps/lambda-utils";
import * as AWS from "aws-sdk";

type Item = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  if (!event.queryStringParameters) {
    return callback(
      null,
      generateResponse("badRequest", {
        message: "Missing parameters",
        created: false,
      })
    );
  }

  const id = event.queryStringParameters.id;

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
    Key: {
      id,
    },
  };

  try {
    const response = await dynamoDb.get(params).promise();

    if (!response.Item) {
      return callback(
        null,
        generateResponse("internalServerError", {
          error: "Missing Attribute Map",
        })
      );
    }

    const { createdAt, updatedAt } = response.Item;

    return callback(
      null,
      generateResponse(
        "success",
        {
          success: true,
          id,
          createdAt,
          updatedAt,
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
