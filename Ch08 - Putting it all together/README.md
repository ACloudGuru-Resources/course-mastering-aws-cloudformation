
## Deploy Custom Cloud Portal

1) [Setup Personal Access Token](https://github.com/settings/tokens)
2) [Create/Encrypt SSMParam Secrets](#Create/Encrypt-SSMParam-Secrets)
3) [Deploy Backend](#Deploy-Backend)
4) [Build & Run Local Frontend](#Build-&-Run-Local-Frontend)

### Create/Encrypt SSMParam Secrets
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

### Deploy Backend
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
