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

//-----------------------------------------------------------------------------------------------------
// ----ADD TRANSACTION---------------------------------------------------------------------------------

module.exports.addTransaction = async (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  const requestId = context.awsRequestId;

  const params = {
    TableName: "Transactions",
    Item: {
      id: requestId,
      date: JSON.stringify(new Date()),
      amount: reqBody.amount,
      iban_from: reqBody.iban_from,
      iban_to: reqBody.iban_to,
      description: reqBody.description,
    },
  };

  return ddb
    .put(params)
    .promise()
    .then(() => {
      callback(
        null,
        response(201, "Transaction " + requestId + " has been created")
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

//-----------------------------------------------------------------------------------------------------
// ----GET REPORT--------------------------------------------------------------------------------------

module.exports.getReport = async (event, context, callback) => {
  const iban = event.pathParameters.iban;

  const params = {
    TableName: "Transactions",
    FilterExpression: "iban_to = :ib_to OR iban_from = :ib_from",
    ExpressionAttributeValues: {
      ":ib_to": iban,
      ":ib_from": iban,
    },
  };

  const params2 = {
    TableName: "Customers",
    FilterExpression: "iban = :ib",
    ExpressionAttributeValues: {
      ":ib": iban,
    },
  };

  try {
    const data = await ddb.scan(params).promise();
    const data2 = await ddb.scan(params2).promise();
    const combinedDate = { TRANSACTIONS: data, CUSTOMERS: data2 };

    if (combinedDate) {
      return callback(null, response(200, combinedDate));
    } else {
      return callback(
        null,
        response(404, {
          error: "No transcations were found that match that iban.",
        })
      );
    }
  } catch (err) {
    return callback(null, response(err.statusCode, err));
  }
};
