
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

## Deploy Backend
```bash
yarn install
yarn build:backend
yarn deploy:backend \
  STAGE=prod \
  STAGE_FLAG=prod \
  REGION=us-east-1 \
  PROFILE=cloudguru \
  DEPLOY_BUCKET=acg-deploy-bucket \
  GITHUB_USER=iDVB
```

## Build & Run Local Frontend
```bash
yarn start
```
