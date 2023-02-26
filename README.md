# Squares

Digital football squares (or whatever use case you may have for digital squares).

> ### [Backlog & Progress](https://github.com/users/billycougz/projects/1)

## Tech

- React
- MUI
- Node.js
- GitHub Pages
- AWS Lambda
- AWS API Gateway
- AWS DynamoDB
- AWS SNS
- AWS CloudWatch
- AWS Route 53

## Technical Notes

### Lambda deploy

`rm squares-lambda.zip`
`aws lambda update-function-code --function-name squares-function --zip-file fileb://./squares-lambda.zip`

### Local Dynamo

`aws dynamodb list-tables --endpoint-url http://localhost:8000`
`aws dynamodb scan --table-name SquaresTable --endpoint-url http://localhost:8000`
