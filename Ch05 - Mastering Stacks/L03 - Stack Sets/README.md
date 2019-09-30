
## Steps
- Deploy StackSet Permissions Stack to Admin Account 
- Deploy StackSet Permissions Stack to Target Accounts

## Environment Vars
```shell
PROFILE=cloudguru
PROFILE_TARGET_1=cloudguru1
PROFILE_TARGET_2=cloudguru2
STACKSET_NAME=asg-stackset
REGION=us-east-1
REGION_2=us-west-1
AWS_ACCOUNT_ID=AAAAAAAAAAAA
AWS_ACCOUNT_ID_1=XXXXXXXXXXXX
AWS_ACCOUNT_ID_2=YYYYYYYYYYYY
```

## Deploy Permission Stack to Admin Account
```shell
aws cloudformation create-stack \
  --stack-name acg-stackset-permissions \
  --template-url https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetAdministrationRole.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```

## Deploy Permission Stack to Target Accounts
```shell
aws cloudformation create-stack \
  --stack-name acg-stackset-permissions \
  --template-url https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetExecutionRole.yml \
  --parameters ParameterKey=AdministratorAccountId,ParameterValue=$AWS_ACCOUNT_ID,UsePreviousValue=true,ResolvedValue=string \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE_TARGET_1

aws cloudformation create-stack \
  --stack-name acg-stackset-permissions \
  --template-url https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetExecutionRole.yml \
  --parameters ParameterKey=AdministratorAccountId,ParameterValue=$AWS_ACCOUNT_ID,UsePreviousValue=true,ResolvedValue=string \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE_TARGET_2
```

## Create StackSet
```shell
aws cloudformation create-stack-set \
  --stack-set-name $STACKSET_NAME \
  --template-body template.yaml \
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
  --accounts "['$AWS_ACCOUNT_ID_1','$AWS_ACCOUNT_ID_2']" \
  --regions "['$REGION','$REGION_2']" \
  --operation-preferences \
    FailureToleranceCount=0,\
    MaxConcurrentCount=1
```
