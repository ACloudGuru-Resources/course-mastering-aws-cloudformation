
## STEPS
1. [Deploy Setup Template](#Deploy-Setup-Template)
2. Go to `service-roles-setup` stack outputs and copy `CFStackRoleArn`, `SupportUserKeyID`, `SupportUserKeySecret`.
3. Go to `~/.aws/credentials` and [Create Support Profile](#Create-Support-Profile) using `SupportUserKeyID` and `SupportUserKeySecret`.
4. Paste `CFStackRoleArn` into `ROLEARN` in the commands below.
5. [Deploy Template WITHOUT Service Role](#Deploy-Template-WITHOUT-Service-Role)
6. [Deploy Template WITH Service Role](#Deploy-Template-WITH-Service-Role)
7. [Delete Stack WITHOUT Service Role](#Delete-Stack-WITHOUT-Service-Role)
8. [Delete Stack WITH Service Role](#Delete-Stack-WITH-Service-Role)

## Deploy Setup Template
```bash
PROFILE=cloudguru
REGION=us-east-1
STACKNAME=service-roles-setup
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file setup.yaml \
  --region $REGION \
  --profile $PROFILE \
  --capabilities CAPABILITY_NAMED_IAM
```

## Create Support Profile
```
[support]
region = PASTE_REGION_HERE
aws_access_key_id = PASTE_KEY_HERE
aws_secret_access_key = PASTE_SECRET_HERE
```

## Deploy Template WITHOUT Service Role
```bash
PROFILE=cloudguru
REGION=us-east-1
STACKNAME=service-roles-no-role
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --region $REGION \
  --profile $PROFILE \
  --capabilities CAPABILITY_NAMED_IAM
```

## Deploy Template WITH Service Role
```bash
ROLEARN=PASTE_SUPPORT_ROLE_ARN_HERE
PROFILE=cloudguru
REGION=us-east-1
STACKNAME=service-roles-with-role
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --role-arn $ROLEARN \
  --region $REGION \
  --profile $PROFILE \
  --capabilities CAPABILITY_NAMED_IAM
```

## Delete Stack WITHOUT Service Role
```bash
PROFILE=support
REGION=us-east-1
STACKNAME=service-roles-no-role
aws cloudformation delete-stack \
  --stack-name $STACKNAME \
  --region $REGION \
  --profile $PROFILE
```

## Delete Stack WITH Service Role
```bash
PROFILE=support
REGION=us-east-1
STACKNAME=service-roles-with-role
aws cloudformation delete-stack \
  --stack-name $STACKNAME \
  --region $REGION \
  --profile $PROFILE
```

## Helpful URLS
- [AWS CLI profile config](https://docs.aws.amazon.com/cli/latest/topic/config-vars.html)

