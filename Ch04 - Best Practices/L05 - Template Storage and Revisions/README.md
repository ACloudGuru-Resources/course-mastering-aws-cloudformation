
## Deploy Setup Template
```bash
PROFILE=cloudguru
REGION=us-east-1
CourseBucketParam=acg-deploy-bucket
STACKNAME=template-storage-setup
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file setup.yaml \
  --parameter-overrides CourseBucketParam=$CourseBucketParam \
  --region $REGION \
  --profile $PROFILE \
  --capabilities CAPABILITY_NAMED_IAM
```

## Helpful Links
[GitHub Action Variables](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables)
[GitHub Action Workflows](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions)
[Awesome Actions](https://github.com/sdras/awesome-actions)
