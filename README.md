# SAM CSRF Protection Example

## Overview

This example demonstrates a simple serverless application using AWS Serverless Application Model (SAM) to implement Cross-Site Request Forgery (CSRF) protection utilizing Lambda functions and an API Gateway API. It consists of two AWS Lambda functions (with associated API Gateway endpoints): one serving a web page and another handling form submissions with CSRF token validation.

## Structure

- `./template.yaml`: AWS SAM template defining the AWS resources.
- `./webpage/app.js`: Contains the Lambda function code for serving the webpage.
- `./webpage/tests/unit/test-handler.js`: Contains the unit tests for the webpage.
- `./submission/app.js`: Contains the Lambda function code for handling form submissions.
- `./submission/tests/unit/test-handler.js`: Contains the unit tests for the form submissions.

## Setup

### Prerequisites

- AWS CLI, configured with appropriate access rights.
- AWS SAM CLI.
- Node.js (version 20.x or higher).
- Docker (for local testing)

### Local Testing

1. Clone the repository and navigate into the project directory.
2. Deploy the application to your AWS account (in its current form the `sam build` step is not required for this project):
   ```
   sam local start-api
   ```

### Deployment

1. Clone the repository and navigate into the project directory.
2. Deploy the application to your AWS account (in its current form the `sam build` step is not required for this project):
   ```
   sam deploy --guided
   ```

## Usage

After deployment, the SAM CLI will output the URL for the deployed webpage. Access this URL in a browser to view and interact with the web form.

## Security Considerations for Real Environment

When adapting this example for a production environment, consider the following enhancements to ensure robust security:

### Use AWS Secrets Manager or Parameter Store

- **Manage Secrets**: Store sensitive values like `ENCRYPTION_KEY_BASE` and `CSRF_TOKEN_SECRET` in AWS Secrets Manager or AWS Systems Manager Parameter Store. This practice ensures that secrets are not hardcoded in your code or SAM template and provides features like automatic rotation and secure retrieval.

- **Implementation**: Retrieve these secrets at runtime in your Lambda function. Make sure to handle the asynchronous nature of these calls.

### Utilize Stronger Encryption Algorithms

- **Algorithm Upgrade**: Consider using a more secure encryption algorithm, like AES-GCM, which provides both encryption and integrity verification. This change requires modifications to the encryption and decryption logic in your Lambda functions.

### Input Validation and Sanitization

- **Sanitize User Inputs**: Always validate and sanitize user inputs to protect against injection attacks. Use libraries for comprehensive sanitization, especially for different contexts like HTML or SQL.

### Secure API Endpoints

- **API Gateway Security**: Implement security measures on your API Gateway, like resource policies, to restrict access. Consider using WAF (Web Application Firewall) to protect against common web attacks.

## Cleanup

To delete the example application that you deployed, run the following:
   ```
   sam delete
   ```

## Contributing

Contributions to enhance this example are welcome. Please update this README.md file as applicable for any changes.
