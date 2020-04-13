
## Create and Encrypt SSMParam Secrets
```bash
REGION=us-east-1
PROFILE=cloudguru
aws ssm put-parameter \
    --name /acg/portal/secrets/prod \
    --type SecureString \
    --value "$(cat secrets.json)" \
    --overwrite \
    --region $REGION \
    --profile $PROFILE
```
