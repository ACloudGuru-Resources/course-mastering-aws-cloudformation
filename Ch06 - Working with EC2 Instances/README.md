http://www.codeandcompost.com/post/cfn,-utf8-and-two-days-i%E2%80%99ll-never-get-back


https://github.com/csumpter/ghost-cloudformation/blob/master/master.yaml


### Deploy Template
```shell
STACKNAME=acg-ghostblog
REGION=us-east-1
PROFILE=cloudguru
aws cloudformation deploy \
  --stack-name $STACKNAME \
  --template-file template.yaml \
  --parameter-overrides $(cat params.toml) \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION \
  --profile $PROFILE
```
