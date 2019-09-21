
### PACKAGE Custom Resource Template
```shell
REGION=us-east-1
PROFILE=cloudguru
DEPLOY_BUCKET=acg-deploy-bucket
aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket $DEPLOY_BUCKET \
  --output-template-file packaged.yaml \
  --region $REGION \
  --profile $PROFILE
```

### DEPLOY Custom Resource Template
```shell
STACKNAME=macro-stringfunctions
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file packaged.yaml \
  --capabilities CAPABILITY_IAM \
  --region $REGION \
  --profile $PROFILE
```

### DEPLOY Template USING Custom Resource
```shell
STACKNAME=usage-stringfunctions
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file usage.yaml \
  --capabilities CAPABILITY_IAM \
  --region $REGION \
  --profile $PROFILE
```
