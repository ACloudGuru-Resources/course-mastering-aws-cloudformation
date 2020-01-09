
## DEMO: Nested Stacks
### Steps
1. `Upload Templates` to course bucket
2. Deploy `START` Template

### Upload Templates
```shell
PROFILE=cloudguru
REGION=us-east-1
CourseBucketParam=acg-deploy-bucket
aws s3 sync \
  . s3://$CourseBucketParam/coursefiles/nestedstacks \
  --exclude "*" \
  --include "*.yaml" \
  --region $REGION \
  --profile $PROFILE
```

### Deploy *START* Template
```shell
STACKNAME=usage-nestedstacks
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file root.yaml \
  --parameter-overrides ActionParam=START CourseBucketParam=$CourseBucketParam \
  --region $REGION \
  --profile $PROFILE
```

## DEMO: Recovering Failed Stacks 
### Steps
3. Run `Cause Failure` CLI commands
4. Deploy `FAIL` Template
5. Wait for all stacks to settle (no "in progess")
6. Run `ContinueUpdateRollback` skipping ASG
7. Templates should now be in the green
8. Manually Delete manualy created LC

### Run *Cause Failure* CLI commands
```shell
ASGSTACK=`aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, '$STACKNAME') && contains(StackName, 'ASGStack')].StackName" \
  --output text \
  --region $REGION \
  --profile $PROFILE`
LCSTACK=`aws cloudformation describe-stacks \
  --query "Stacks[?contains(StackName, '$STACKNAME') && contains(StackName, 'LCStack')].StackName" \
  --output text \
  --region $REGION \
  --profile $PROFILE`
aws autoscaling create-launch-configuration \
  --launch-configuration-name DansNewLC \
  --image-id ami-0b69ea66ff7391e80 \
  --instance-type t2.nano \
  --region $REGION \
  --profile $PROFILE
ASGName=`aws cloudformation describe-stack-resources \
  --stack-name $ASGSTACK \
  --logical-resource-id ASG \
  --output text \
  --query 'StackResources[0].PhysicalResourceId' \
  --region $REGION \
  --profile $PROFILE`
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name $ASGName \
  --launch-configuration-name DansNewLC \
  --region $REGION \
  --profile $PROFILE
LCName=`aws cloudformation describe-stack-resources \
  --stack-name $LCSTACK \
  --logical-resource-id LC \
  --output text \
  --query 'StackResources[0].PhysicalResourceId' \
  --region $REGION \
  --profile $PROFILE`
aws autoscaling delete-launch-configuration \
  --launch-configuration-name $LCName \
  --region $REGION \
  --profile $PROFILE
```

### Deploy *FAIL* Template
```shell
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file root.yaml \
  --parameter-overrides ActionParam=FAIL CourseBucketParam=$CourseBucketParam \
  --region $REGION \
  --profile $PROFILE
```

### Run *ContinueUpdateRollback*
```shell
aws cloudformation continue-update-rollback \
  --stack-name $STACKNAME \
  --resources-to-skip "$ASGSTACK.ASG" \
  --region $REGION \
  --profile $PROFILE
```

### Deploy *RECOVER* Template
```shell
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file root.yaml \
  --parameter-overrides ActionParam=RECOVER CourseBucketParam=$CourseBucketParam \
  --region $REGION \
  --profile $PROFILE
```
