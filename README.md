# Squares

**Digital Football Squares for the Modern Fan.**

Squares is a full-stack web application that modernizes the classic Super Bowl (or any game) squares pool. Gone are the days of paper grids and manual tracking. Squares offers a seamless, interactive digital experience for creating boards, managing participants, and tracking real-time results.

> ### [Backlog & Progress](https://github.com/users/billycougz/projects/1)

## Features

-   **Easy Board Creation**: Create a new squares board in seconds.
-   **Admin Control**: Secure admin links to manage your board without accounts.
-   **Interactive Grid**: Participants can view the grid and their assigned squares on any device.
-   **SMS Integration**:
    -   **Creator Notifications**: Receive a text with your admin and shareable links immediately upon creation.
    -   **Participant Subscriptions**: Users can subscribe to receive SMS updates about board status and results.
-   **Payout Management**:  Customizable payout sliders for each quarter.

## Tech Stack

This project leverages a serverless architecture for scalability and low maintenance.

**Frontend:**
-   **React** (Create React App)
-   **MUI** (Material UI) for responsive and accessible components.
-   **Axios** for API communication.

**Backend:**
-   **Node.js** running on **AWS Lambda** (Serverless compute).
-   **Express.js** (Used for local development proxy).
-   **AWS DynamoDB** (NoSQL database for storing board data).
-   **AWS SNS** (Simple Notification Service) for sending SMS messages.

**Infrastructure:**
-   **AWS API Gateway**: Exposes the Lambda functions as RESTful endpoints.
-   **AWS CloudWatch**: Monitoring and logging.
-   **AWS Route 53**: Domain management.

## Architecture Overview

1.  **Client**: The React app hosts the user interface. It makes REST API calls to the backend.
2.  **API Layer**:
    -   **Production**: AWS API Gateway routes requests to the `squares-function` Lambda.
    -   **Local**: A local Express server (`server.js`) proxies requests to the Lambda handler (`lambda/src/index.js`).
3.  **Compute**: The AWS Lambda function (`squares-function`) handles the business logic (Create Board, Get Board, Subscribe).
4.  **Storage**: AWS DynamoDB stores the state of every board (grid data, settings, participants).
5.  **Notifications**: AWS SNS is triggered by the Lambda function to send SMS updates.

## Local Development

### Prerequisites

-   **Node.js** (v14+ recommended)
-   **AWS CLI** configured with your credentials (for deployment).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/billycougz/squares.git
    cd squares
    ```

2.  **Install Application Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

### Running the Application

You need to run both the backend server and the frontend client.

1.  **Start the Backend Server (Lambda Proxy):**
    ```bash
    npm run server
    ```
    Runs on `http://localhost:8080`.

2.  **Start the Frontend Client:**
    ```bash
    npm run client
    ```
    Runs on `http://localhost:3000`.

3.  **Running with Mock Data (Optional):**
    If you want to run the frontend without the backend or local database, you can use the mock API.
    Create a `.env.local` file in the `client/` directory and add the following line:

    ```env
    REACT_APP_DO_MOCK=true
    ```
    This will bypass API calls and use local storage for data persistence.

## Deployment

### Lambda Functions

To update the backend code on AWS Lambda:

```bash
# Zips the lambda/ directory and updates the function code on AWS
# Ensure you have the 'zip' utility installed
rm squares-lambda.zip
zip -r squares-lambda.zip lambda/
aws lambda update-function-code --function-name squares-function --zip-file fileb://./squares-lambda.zip
rm squares-lambda.zip
```
*(See `Technical Notes` section below or `package.json` scripts if configured).*

### Client (GitHub Pages)

The frontend is deployed to GitHub Pages.

```bash
npm run deploy
```
This runs `npm run build` in the client directory and pushes the build to the `gh-pages` branch.

## Security Notes

### Admin Code Handling (Temporary Client-side Fix)
There is currently a "quirky" behavior where the backend API may include the `adminCode` in the response for non-admin users (e.g., during board refresh or square updates). 

A transient fix has been implemented in the frontend (`AppContextProvider.js`) to prevent this code from being saved to `localStorage`. The frontend now strictly adheres to the rule that it will only trust and persist an `adminCode` if it was already known locally or explicitly provided via an admin-linked initial load.

### TODO: Server-side Security
The long-term solution is to sanitize the API responses on the backend.
- [ ] Update `lambda/src/handlers/handleGet.js` to strip `adminCode` if a valid one isn't provided/matched in the request.
- [ ] Update `lambda/src/handlers/handlePut.js` to strip `adminCode` from all success responses.
- [ ] Update documentation once Lambda functions are redeployed with these security enhancements.
