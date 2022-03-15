"use strict";

const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

// ----UTILITY----------------------------------------------------------------------

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
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

//------GET ALL CUSTOMER--------------------------------------------------------

module.exports.getAllCustomers = (event, context, callback) => {
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

// ------GET SINGLE CUSTOMER------------------------------------------------------

module.exports.getCustomer = (event, context, callback) => {
  const id = event.pathParameters.id;

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
      else callback(null, response(404, { error: "Customer not found" }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
