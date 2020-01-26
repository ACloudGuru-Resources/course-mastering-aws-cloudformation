
## DEMO: Working with EC2

### Steps
1. Update params in `params.toml`
2. Edit `template.yaml` to include cfn-hup code
3. `Deploy Template` to course bucket

### CMDs for UserData cfn-hup Setup
```bash
cp /usr/local/init/ubuntu/cfn-hup /etc/init.d/cfn-hup
chmod +x /etc/init.d/cfn-hup
update-rc.d cfn-hup defaults
```

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

*Get the EC2's Public DNS Name:* 
`curl -s http://169.254.169.254/latest/meta-data/public-hostname`

*Connecting to EC2:*
```shell
ssh -i /path/my-key-pair.pem ec2-user@ec2-123-123-123-1.compute-1.amazonaws.com
```

*List all services:*
```shell
service --status-all
```

*Location of Log Files:*
```
/var/log/cfn-init.log
/var/log/cfn-init-cmd.log
```

*Live tail changes to cfn-hup.log*
`tail -f /var/log/cfn-init.log`
