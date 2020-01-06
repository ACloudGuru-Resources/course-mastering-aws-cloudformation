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

### Connect to EC2
```shell
ssh -i /path/my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html

### Location of Log Files
`/var/log/cfn-init.log`

### Helpful commands

Get the EC2's Public DNS Name: 
`curl -s http://169.254.169.254/latest/meta-data/public-hostname`
