# AWS Lambda - Headless Chrome with Tor

Use headless chrome with tor in aws lambda.

## Requirements

- serverless
- [aws-tor-layer](https://github.com/yusugomori/aws-tor-layer): Tor layer must be deployed in advance.

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

Try 

```
$ sls invoke local -f handler
```

## Deployment

```shell
$ sls deploy [options]

Options
  --profile <profile>  AWS IAM profile.
  --stage <stage>      Deployment environment. Allowed values are: development, staging, production.
                       Default: development
```
