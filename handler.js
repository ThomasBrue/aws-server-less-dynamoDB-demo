"use strict";

module.exports.hello = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          "Go Serverless v1.0! Your function executed successfully! Yes Sir!",
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.userInfo = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        name: "Jimmy",
        age: "5",
        city: "Paris",
      },
      null,
      2
    ),
  };
};

module.exports.eatApple = async (event, context, callback) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "I like to eat apples",
      },
      null,
      2
    ),
  };
};

const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.writeMessage2 = async (event, context, callback) => {
  console.log("WriteMessage2 was called....................................");
  const requestId = context.awsRequestId;

  await createMessage(requestId)
    .then(() => {
      callback(null, {
        statusCode: 201,
        body: "",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

function createMessage(requestId) {
  const params = {
    TableName: "Message",
    Item: {
      messageId: requestId,
      message: "Hello from lambda Yesssssssssssssss",
    },
  };

  return ddb.put(params).promise();
}
