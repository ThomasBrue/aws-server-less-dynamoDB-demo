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
  const requestId = context.awsRequestId;

  // await createCustomerObj(requestId)
  //   .then(() => {
  //     callback(
  //       null,
  //       response(201, "Customer " + requestId + " has been created")
  //     );
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  const params = {
    TableName: "Customers",
    Item: {
      id: requestId,
      name: "Bobby",
      iban: "AT00001" + Math.floor(Math.random() * 100),
      address: {
        street: "Sunnystreet 5",
        city: "Vienna",
        zipCode: "1130",
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

// function createCustomerObj(reqId) {
//   const params = {
//     TableName: "Customers",
//     Item: {
//       id: reqId,
//       name: "Bobby",
//       iban: "AT00001" + Math.floor(Math.random() * 100),
//       address: {
//         street: "Sunnystreet 5",
//         city: "Vienna",
//         zipCode: "1130",
//       },
//     },
//   };

// }

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
