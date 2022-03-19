# Assignment: Serverless

### Thomas Bründl

### se21m032

# Introduction

In this exercise the goal was to create a banking app that allows the user to interact with a serverless banking app with persistence. User interaction can be done via postman (no frontend). As a serverless provider I have choosen AWS (AWS-Lambda, DynamoDB).

# How it works?

Use Postman (or any other API-testing tool) to execute following http-requests: <br />

Note: I deleted all my lambda funtions on AWS to be not exposed to misused requests. (I don't want to pay e.g. 10000$ due to some attack.)
However the lambda funtions can be deployed again via one command as explained in "How is the Project set up?".

## Create Customer

Add a customer to the Customers table:

https://qcoom8ft88.execute-api.us-east-1.amazonaws.com/users/createCustomer

HTTP-method: POST

Paste in the Body-section (raw) the following JSON:

```json
{
  "name": "Simon",
  "iban": "AT000777",
  "address": {
    "street": "Sunnystreet 5",
    "city": "Vienna",
    "zipCode": "1130"
  }
}
```

## Get All Customers

Display all customers that are on the database:

https://qcoom8ft88.execute-api.us-east-1.amazonaws.com/users/getAllCustomers

HTTP-method: GET

## Get Single Customers

Display all customers that are on the database:

https://qcoom8ft88.execute-api.us-east-1.amazonaws.com/users/getCustomer/7d15f55a-d21f-4e33-83c6-fcc0f0ffb10f

HTTP-method: GET

## Create Customer

Add a transaction to the Transactions table:

https://qcoom8ft88.execute-api.us-east-1.amazonaws.com/users/addTransaction

HTTP-method: POST

Paste in the Body-section (raw) the following JSON:

```json
{
  "iban_from": "AT000777",
  "iban_to": "AT000999",
  "amount": 12345,
  "description": "This is a transaction description."
}
```

## Get Report

Displays a report that consists of the user/s that have the argument IBAN (e.g. AT000777). <br />
Output is the user profile and all the transactions that have the user in the iban_from or iban_to column.

https://qcoom8ft88.execute-api.us-east-1.amazonaws.com/users/getReport/AT000777

HTTP-method: GET

# How is the Project set up?

1. Install the serverless sdk via "npm i serverless". <br />
   (You can check if serverless was installed correctly via "serverless --version")

2. Set up your AWS key with serverless: <br />
   serverless config credentials --provider aws --key AAAAAAAAAAAAAAAAAAAAA --secret BBBBBBBBB/BBBBBBBBBBBBBBBBBBBBBBBBBBB <br />
   (In the example above I don'd display my real key.)

3. You can create a Hello-World-Example-Project via "serverless create -t aws-nodejs".

4. Now you can deploy the project to AWS via "serverless deploy". (You have to run the command in the same directory as the serverless.yml)
