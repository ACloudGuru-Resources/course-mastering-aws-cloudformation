# Steps:
- Deploy Base Template
- Create ChangeSet A
- Create ChangeSet B
- Describe ChangeSet A
- Execute ChangeSet A

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

## Create ChangeSet A
```shell
aws cloudformation create-change-set \
  --stack-name $STACKNAME \
  --change-set-name changeSetA \
  --template-body file://changesetA.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```
## Create ChangeSet B
```shell
aws cloudformation create-change-set \
  --stack-name $STACKNAME \
  --change-set-name changeSetB \
  --template-body file://changesetB.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

## Describe ChangeSet A
```shell
aws cloudformation describe-change-set \
  --stack-name $STACKNAME \
  --change-set-name changeSetA \
  --region $REGION \
  --profile $PROFILE
```

## Execute ChangeSet A
```shell
aws cloudformation execute-change-set \
  --stack-name $STACKNAME \
  --change-set-name changeSetA \
  --region $REGION \
  --profile $PROFILE
```
