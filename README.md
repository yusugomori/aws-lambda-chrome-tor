# AWS Lambda - Headless Chrome with Tor

Use headless chrome with tor in aws lambda.

## Requirements

- serverless
- [aws-tor-layer](https://github.com/yusugomori/aws-tor-layer): Tor layer must be deployed in advance.

You need to manually install and start `tor` for local development.

## Development

First, create deployment bucket for serverless with below:

```
$ make s3 [options]

Options
  ENV=<environment>   Deployment environment. Allowed values are: development, staging, production.
                      Default: development
  REGION=<region>     AWS region. Default: ap-northeast-1
  PREFIX=<prefix>     Project name prefix for cloudformation.
                      Default: chrome-tor
  PROFILE=<profile>   AWS IAM profile. Default: default
```

Then, try below for local execution:

```
$ sls invoke local -f app [options]

Options
  --profile <profile>  AWS IAM profile.
```

## Deployment

```shell
$ sls deploy [options]

Options
  --profile <profile>  AWS IAM profile.
  --stage <stage>      Deployment environment. Allowed values are: development, staging, production.
                       Default: development
```
