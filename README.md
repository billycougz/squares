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

> [!WARNING]
> **SECURITY ALERT**: Never commit your `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` to git, not even in a private repository. Always use your hosting provider's environment variable configuration system (e.g., Vercel Project Settings > Environment Variables).

## Known Issues & Future Improvements (TODOs)

- **Hardcoded Frontend URL**: The file `src/lib/aws/AWS.js` contains a hardcoded `BASE_FRONTEND_URL` (`https://squares.billycougan.com`). This is used for generating links in SNS notifications.
    - **TODO**: Refactor this to use an environment variable (e.g., `NEXT_PUBLIC_BASE_URL`) so it works correctly in preview deployments and other environments.
- **SNS Integration**: `src/lib/aws/sns.js` uses a hardcoded `TopicArn`. This is specific to the original AWS account and region.
    - **TODO**: Move the ARN to an environment variable or dynamically query it.
- **API CORS Policy**: `src/pages/api/squares.js` currently allows all origins (`Access-Control-Allow-Origin: *`).
    - **TODO**: Restrict this to your specific domains for better security in production.
