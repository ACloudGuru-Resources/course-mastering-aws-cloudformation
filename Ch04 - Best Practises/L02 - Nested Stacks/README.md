
## Copy templates to course bucket
```
aws s3 sync \
  . s3://acg-deploy-bucket/coursefiles/nestedstacks \
  --exclude "*" \
  --include "*.yaml" \
  --exclude "parent.yaml" \
  --profile cloudguru
```

## Deploy Master Template
```
aws cloudformation deploy \
  --stack-name usage-nestedstacks \
  --template-file parent.yaml \
  --parameter-overrides CourseBucketParam=acg-deploy-bucket \
  --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_IAM \
  --profile cloudguru
```
