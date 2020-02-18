
## Steps
- Deploy StackSet Permissions Stack to Admin Account 
- Deploy StackSet Permissions Stack to Target Accounts

## Environment Vars
```shell
PROFILE=cloudguru
PROFILE_1=cloudguru1
PROFILE_2=cloudguru2
STACKSET_NAME=acg-stackset
REGION=us-east-1
REGION_2=us-west-1
AWS_ACCOUNT_ID=XXXXXXXXXXXXX
AWS_ACCOUNT_ID_1=YYYYYYYYYYYY
AWS_ACCOUNT_ID_2=ZZZZZZZZZZZZ
```

## Deploy Permission Stack to Admin Account
```shell
aws cloudformation create-stack \
  --stack-name acg-stackset-permissions \
  --template-body file://./AWSCloudFormationStackSetAdministrationRole.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

## Deploy Permission Stack to Target Accounts
```shell
aws cloudformation create-stack \
  --stack-name acg-stackset-permissions \
  --template-body file://./AWSCloudFormationStackSetExecutionRole.yml \
  --parameters ParameterKey=AdministratorAccountId,ParameterValue=$AWS_ACCOUNT_ID,UsePreviousValue=true,ResolvedValue=string \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE_1

aws cloudformation create-stack \
  --stack-name acg-stackset-permissions \
  --template-body file://./AWSCloudFormationStackSetExecutionRole.yml \
  --parameters ParameterKey=AdministratorAccountId,ParameterValue=$AWS_ACCOUNT_ID,UsePreviousValue=true,ResolvedValue=string \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE_2
```

## Create StackSet
```shell
aws cloudformation create-stack-set \
  --stack-set-name $STACKSET_NAME \
  --template-body file://./template.yaml \
  --profile $PROFILE
```

## List StackSets
```shell
aws cloudformation list-stack-sets \
  --profile $PROFILE
```

## Add StackSet Instances
```shell
aws cloudformation create-stack-instances \
  --stack-set-name $STACKSET_NAME \
  --accounts $AWS_ACCOUNT_ID_1 $AWS_ACCOUNT_ID_2 \
  --regions $REGION $REGION_2 \
  --profile $PROFILE \
  --operation-preferences FailureToleranceCount=0,MaxConcurrentCount=1
```

## Update StackSet Changing BucketName
```shell
aws cloudformation update-stack-set \
  --stack-set-name $STACKSET_NAME \
  --template-body file://./template.yaml \
  --region $REGION \
  --profile $PROFILE
```

## Deploy Account Gate Functions for Target Accounts
```shell
aws cloudformation deploy \
  --stack-name acg-account-gate \
  --template-file setup.yaml \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE_1

aws cloudformation deploy \
  --stack-name acg-account-gate \
  --template-file setup.yaml \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION_2 \
  --profile $PROFILE_2
```

## Helpful Commands

List Stacks
```shell
aws cloudformation list-stacks \
  --region $REGION \
  --profile $PROFILE
```

Delete Stack
```shell
aws cloudformation delete-stack \
  --stack-name acg-stackset-permissions \
  --region $REGION \
  --profile $PROFILE_1
```

## Helpful Links

- [Custom StackSetsResource](https://github.com/awslabs/aws-cloudformation-templates/blob/master/aws/solutions/StackSetsResource/Templates/stack-set-template.yaml)
