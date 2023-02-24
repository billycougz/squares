# Squares

Digital football squares (or whatever use case you may have for digital squares).

## Tech

- React
- MUI
- GitHub Pages
- AWS Lambda
- AWS API Gateway
- AWS CloudWatch
- AWS DynamoDB
- AWS SNS
- AWS Route 53

## Backlog

- Swap team sides
- Per person square limits
- Unique URLs
- Dynamic teams and/or colors
- Admin click mode UX (e.g., confirm on result click)
- Cleanup redundancies (e.g., the quick sx styles and logic)
- Lambda refactor

## Technical Notes

### Lambda deploy

`aws lambda update-function-code --function-name squares-function --zip-file fileb://./squares-lambda.zip`
