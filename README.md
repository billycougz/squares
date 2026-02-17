# Squares

The online platform for football squares.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

## Deploy on Vercel

### Environment Variables

| Variable | Description | Privacy |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_DO_MOCK` | Set to `false` to use the real AWS backend. Set to `true` for local mock dev. | Public |
| `AWS_REGION` | The AWS region where your DynamoDB and SNS are hosted (e.g., `us-east-1`). | **SECRET** |
| `AWS_ACCESS_KEY_ID` | Your AWS IAM Access Key ID. | **SECRET** |
| `AWS_SECRET_ACCESS_KEY` | Your AWS IAM Secret Access Key. | **SECRET** |
| `SQUARES_TABLE_NAME` | The DynamoDB table name (e.g., `SquaresTable`). | **SECRET** |
| `BASE_FRONTEND_URL` | The base URL of the frontend (e.g., `https://squares.billycougan.com`). | Server-side |
| `SNS_TOPIC_ARN` | The ARN of the SNS topic for notifications. | **SECRET** |

> [!WARNING]
> **SECURITY ALERT**: Never commit your `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` to git, not even in a private repository. Always use your hosting provider's environment variable configuration system (e.g., Vercel Project Settings > Environment Variables).

## Project Structure

The project follows a standard Next.js architecture with separation of concerns between the frontend, backend API, and business logic.

- **`src/pages/`**:
  - **`_app.js`**, **`index.js`**: Main entry points and frontend routing.
  - **`api/`**: Next.js API Routes. served at `/api/*`. These act as the backend controllers.
- **`src/services/`**:
  - **`backend/`**: Contains business logic used by API routes.
    - `BoardService.js`: Manages board operations (CRUD, game logic).
    - `NotificationService.js`: Encapsulates SNS notification logic.
- **`src/models/`**:
  - `BoardModel.js`: Data access layer for DynamoDB. Handles reading/writing to the database.
- **`src/lib/`**:
  - `config.js`: **Centralized Configuration**. Validates and exports environment variables (`appConfig`, `awsConfig`).
  - `aws.js`: **Infrastructure**. Initializes AWS clients (`dynamo`, `snsClient`) using the config.
  - `api.js`: Frontend API client helper (axios wrapper).
- **`src/components/`**: Reusable React components (`Board`, `Header`, `SquaresGrid`, etc.).
- **`src/contexts/`**: React Contexts for global state management (`AppContext`, etc.).
