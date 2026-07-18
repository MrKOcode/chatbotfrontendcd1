# Frontend AWS deployment setup

The CloudFormation template creates a private, versioned S3 bucket, a CloudFront distribution with Origin Access Control, security response headers, SPA fallbacks, and a least-privilege GitHub deployment role.

## GitHub OIDC provider

By default, the stack creates an account-level IAM OIDC provider for `https://token.actions.githubusercontent.com` with audience `sts.amazonaws.com`. The provider has a retain policy so removing this frontend stack cannot break other pipelines that later reuse it. If the account already has the provider, supply its ARN with `GitHubOidcProviderArn` instead.

## Deploy the infrastructure

The AWS principal running the initial CloudFormation deployment must be allowed to manage S3, IAM roles/OIDC providers, and these CloudFront resource types: distributions, origin access controls, and response headers policies. `AWSCloudFormationFullAccess` by itself does not grant permission to create the resources described by a template.

From the repository root:

```powershell
aws cloudformation deploy `
  --template-file infrastructure/frontend.yaml `
  --stack-name aichatbot-frontend-production `
  --capabilities CAPABILITY_IAM `
  --parameter-overrides `
    GitHubRepository=MrKOcode/chatbotfrontendcd1 `
    GitHubEnvironment=production
```

Read the stack outputs after deployment:

```powershell
aws cloudformation describe-stacks `
  --stack-name aichatbot-frontend-production `
  --query "Stacks[0].Outputs" `
  --output table
```

## GitHub production environment variables

Create a GitHub environment named `production`. Add these environment variables:

| Variable | Source |
|---|---|
| `AWS_REGION` | Region where the S3 stack is deployed, currently `us-west-2` |
| `AWS_ROLE_ARN` | `DeploymentRoleArn` stack output |
| `S3_BUCKET_NAME` | `BucketName` stack output |
| `CLOUDFRONT_DISTRIBUTION_ID` | `CloudFrontDistributionId` stack output |
| `VITE_API_BASE_URL` | Backend `ApiEndpoint` output without a trailing slash |
| `VITE_COGNITO_USER_POOL_ID` | Backend `UserPoolId` output |
| `VITE_COGNITO_CLIENT_ID` | Backend `UserPoolClientId` output |
| `VITE_COGNITO_DOMAIN` | Backend `HostedUiBaseUrl` output |
| `VITE_COGNITO_REGION` | Backend AWS region, currently `us-west-2` |

These `VITE_*` values are public build configuration, not secrets. Never place credentials or client secrets in a Vite variable.

Configure required reviewers for the `production` environment when the repository plan supports deployment protection rules. Configure `main` branch protection to require the `Frontend CI / Type-check, lint, test, and build` status check and pull requests.

## Backend CORS

After CloudFront is created, update the backend stack's `AllowedCorsOrigin` parameter to `https://<CloudFrontDomainName>` (or the final custom domain) and redeploy the backend. The browser cannot call the API until the backend returns that exact allowed origin.
