# Change Sets

# Deploy Base Template
```shell
STACKNAME=acg-changeset
REGION=us-east-1
PROFILE=cloudguru
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

## Create Change Set
```shell
aws cloudformation create-change-set \
  --stack-name $STACKNAME \
  --change-set-name changesA \
  --template-body file://changes.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

## Describe Change Set
```shell
aws cloudformation describe-change-set \
  --stack-name $STACKNAME \
  --change-set-name changesA \
  --region $REGION \
  --profile $PROFILE
```

## Execute Change Set
```shell
aws cloudformation execute-change-set \
  --stack-name $STACKNAME \
  --change-set-name changesA \
  --region $REGION \
  --profile $PROFILE
```
