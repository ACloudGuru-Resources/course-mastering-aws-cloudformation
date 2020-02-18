
## ENV Variables
```bash
STACKNAME=stack-proxy
DEPLOY_BUCKET=acg-deploy-bucket
REGION=us-east-1
DOMAIN=acg.danvanbrunt.com
GITHUB_WEBHOOK_SECRET=""
GITHUB_ACCESS_TOKEN=""
SSLCERT_ARN="arn:aws:acm:us-east-1:645655324390:certificate/0f3d1402-3d47-4233-b2ac-4a6f0020005e"
PROFILE=cloudguru
```

## Package Template
```bash
yarn build
aws cloudformation package \
  --template-file .aws-sam/build/template.yaml \
  --s3-bucket $DEPLOY_BUCKET \
  --output-template-file .aws-sam/build/packaged.yaml \
  --region $REGION \
  --profile $PROFILE
```

## Deploy StackProxy
```bash
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template .aws-sam/build/packaged.yaml \
  --parameter-overrides \
      DomainParam=$DOMAIN \
      GitHubWebhookSecretParam=$GITHUB_WEBHOOK_SECRET \
      GitHubAccessTokenParam=$GITHUB_ACCESS_TOKEN \
      SSLCertARN=$SSLCERT_ARN \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE
```

```bash
aws cloudformation deploy \
  --stack-name helloworld \
  --template template.yaml \
  --parameter-overrides \
      StageParameter=feat-test \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE
```

## Helpful Commands

```bash
sam local invoke \
  -e tests/macro-stackproxy.json \
  -t .aws-sam/build/template.yaml \
  StackProxyMacroFunction
```


```bash
sam package \
  --template-file ./.aws-sam/build/template.yaml \
  --s3-bucket com.klick.104477223281.us-east-1.prod.sls.deploys \
  --output-template-file ./.aws-sam/build/packaged.yaml
```

```bash
sam deploy \
  --template-file ./.aws-sam/build/packaged.yaml \
  --stack-name dvb-api \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```
