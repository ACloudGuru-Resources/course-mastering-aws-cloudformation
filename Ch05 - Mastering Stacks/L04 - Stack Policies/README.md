
## Steps
- Create Stack
- Deploy Template Deleting DDB Table
- Deploy Template Deleting Lambda Function

# Create Stack
```shell
PROFILE=cloudguru
STACKNAME=acg-stackpolicies
REGION=us-east-1
aws cloudformation create-stack \
  --stack-name $STACKNAME \
  --template-body file://./template.yaml \
  --stack-policy-body file://./stack-policy.json \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE
```

# Deploy Template Deleting DDB Table
```shell
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

# Deploy Template Deleting Lambda Function
```shell
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```
