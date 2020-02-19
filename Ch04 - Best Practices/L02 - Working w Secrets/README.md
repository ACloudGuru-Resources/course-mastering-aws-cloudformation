

### Create SSM Param with encrypted JSON file as value
```shell
STACKNAME=acg-secrets
REGION=us-east-1
PROFILE=cloudguru
aws ssm put-parameter \
    --name /acg/master-cfn/secrets \
    --type SecureString \
    --value "$(cat secrets.json)" \
    --region $REGION \
    --profile $PROFILE
```

### Deploy Secrets Example Template
```shell
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```
