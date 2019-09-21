
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
STACKNAME=acg-custom-resource
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file packaged.yaml \
  --parameter-overrides DomainParameter=companyx.com \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

### DEPLOY Template USING Custom Resource
```shell
STACKNAME=projectx-feat-sls
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file usage.yaml \
  --parameter-overrides StageParameter=feat-sls ServiceParameter=projectx \
  --region $REGION \
  --profile $PROFILE
```
