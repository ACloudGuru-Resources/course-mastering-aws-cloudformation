
## Package Templates
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

## Test Templates
```shell
aws cloudformation validate-template \
  --template-body file://template.yaml
```

## Deploy Templates to S3
```shell
aws s3 sync \
  . s3://$DEPLOY_BUCKET/templates/projectx \
  --exclude "*" \
  --include "*.yaml" \
  --region $REGION \
  --profile $PROFILE
```
