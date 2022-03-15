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
      message: "Johny",
      someValue: "hello dear",
    },
  };

  return ddb.put(params).promise();
}

// ----CREATE CUSTOMER---------------------------------------------------------------------------------

module.exports.createCustomer = async (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  if (reqBody) {
    console.log("hello");
  }

  // const reqBody = JSON.parse(event.body);

  const requestId = context.awsRequestId;

  const params = {
    TableName: "Customers",
    Item: {
      id: requestId,
      name: reqBody.name,
      iban: reqBody.iban,
      address: {
        street: reqBody.address.street,
        city: reqBody.address.city,
        zipCode: reqBody.address.zipCode,
      },
    },
  };

  return ddb
    .put(params)
    .promise()
    .then(() => {
      callback(
        null,
        response(201, "Customer " + requestId + " has been created")
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

//------FETCH CUSTOMER--------------------------------------------------------

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

module.exports.fetchCustomer = (event, context, callback) => {
  return ddb
    .scan({
      TableName: "Customers",
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};

// ------GET SINGLE POST------------------------------------------------------

module.exports.getCustomer = (event, context, callback) => {
  const id = "cd217971-123e-4fa1-8eb7-2206e6d63f7d";

  const params = {
    Key: {
      id: id,
    },
    TableName: "Customers",
  };

  return ddb
    .get(params)
    .promise()
    .then((res) => {
      if (res.Item) callback(null, response(200, res.Item));
      else callback(null, response(404, { error: "Post not found" }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
