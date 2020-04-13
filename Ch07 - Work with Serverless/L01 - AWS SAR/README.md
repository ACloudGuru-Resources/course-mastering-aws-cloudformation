
## Deploy Stack Proxy as AWS SAR App 

### Add SAR Policy to Deploy Bucket
`sar-bucket-policy.json`

### Package Template
```bash
DEPLOY_BUCKET=acg-deploy-bucket
REGION=us-east-1
PROFILE=cloudguru
yarn build
aws cloudformation package \
  --template-file .aws-sam/build/template.yaml \
  --s3-bucket $DEPLOY_BUCKET \
  --output-template-file .aws-sam/build/template.yaml \
  --region $REGION \
  --profile $PROFILE
```

### Create AWS SAR Application
```bash
SAR_VERSION="0.1.0"
SAR_NAME="StackProxy"
SAR_DESC="Serverless Proxy Environment"
SAR_AUTHOR="Cloud Guru"
aws serverlessrepo create-application \
  --author $SAR_AUTHOR \
  --description $SAR_DESC \
  --name $SAR_NAME \
  --semantic-version $SAR_VERSION \
  --template-body file://.aws-sam/build/template.yaml \
  --region $REGION \
  --profile $PROFILE
```

### Create AWS SAR Application Version
```bash
SAR_APP_ID="arn:aws:serverlessrepo:us-east-1:645655324390:applications/StackProxy"
SAR_VERSION="0.2.0"
aws serverlessrepo create-application-version \
  --application-id $SAR_APP_ID \
  --semantic-version $SAR_VERSION \
  --template-body file://.aws-sam/build/template.yaml \
  --region $REGION \
  --profile $PROFILE
```

## Deploy Stack Proxy

### Deploy Instance of Application
```bash
APP_ID="arn:aws:serverlessrepo:us-east-1:645655324390:applications/StackProxy"
STACKNAME=stack-proxy
DOMAIN=acg.danvanbrunt.com
GITHUB_WEBHOOK_SECRET=XXXX
GITHUB_ACCESS_TOKEN=XXXX
SSLCERT_ARN="arn:aws:acm:us-east-1:645655324390:certificate/0f3d1402-3d47-4233-b2ac-4a6f0020005e"
REGION=us-east-1
PROFILE=cloudguru
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template usage.yaml \
  --parameter-overrides \
      ApplicationId=$APP_ID \
      DomainParam=$DOMAIN \
      GitHubWebhookSecretParam=$GITHUB_WEBHOOK_SECRET \
      GitHubAccessTokenParam=$GITHUB_ACCESS_TOKEN \
      SSLCertARN=$SSLCERT_ARN \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE
```


## Deploy Hello World App

### Deploy Hello World Infra
```bash
STACKNAME2=acg-helloworld
aws cloudformation deploy \
  --stack-name $STACKNAME2 \
  --template template.yaml \
  --parameter-overrides \
      StageParameter=feat-test \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE
```

### Deploy Hello World HTML to S3
```bash
BUCKET_NAME=$(aws \
  cloudformation describe-stacks \
  --stack-name $STACKNAME2 \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucket'] | [0].OutputValue" \
  --region $REGION \
  --profile $PROFILE \
  --output text)
aws s3 sync \
  . "s3://${BUCKET_NAME}/" \
  --exclude "*" --include "*.html" \
  --cache-control 'max-age=0, no-cache, no-store, must-revalidate' \
  --content-type text/html --delete \
  --region $REGION \
  --profile $PROFILE
```

