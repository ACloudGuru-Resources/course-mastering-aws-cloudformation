
## DEMO: Working with EC2

### Steps
1. Rename `params-example.toml` to `params.toml` and update params
2. `Deploy Template` to course bucket
3. Deploy `START` Template

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

## Helpful Info

### Helpful commands

*Get the EC2's Public DNS Name:* 
`curl -s http://169.254.169.254/latest/meta-data/public-hostname`

*Connecting to EC2:*
```shell
ssh -i /path/my-key-pair.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```

*Location of Log Files:*
```
/var/log/cfn-init.log
/var/log/cfn-init-cmd.log
```
