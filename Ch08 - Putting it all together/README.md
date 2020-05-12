
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

## Code Review
1) Stack-Repo Relation Tags
2) Feature: Create Branch
3) Feature: Delete Branch


## Improvement Ideas
- Abstract Stacks, Repos and GitHub Actions into "Projects"
- Have environment completion statuses take into account GitHub Action build status
- Use DynamoDB to track relationships rather than just stack tags
- Show all repos, and ablity to hide some from view
- Add lighthouse test to build and be able to view historical results in the Cloud Portal
- Add other stats to Cloud Portal page. Eg. GA, Epsigon, PagerDuty, Code Coverage etc

## Clean up
- GitHub Access Token
- GitHub Repo Secrets
- SSM Params
- Stacks
- CloudWatch Logs
- User, Roles
- SSL Cert
- KMS Key
- Course Deployment bucket

### Delete All Log Groups
`**WARNING** Be very careful, this will delete all the logs in your account. 
Be sure this is what you want to do before running.`
```bash
REGION=us-east-1
PROFILE=cloudguru
aws logs describe-log-groups --query 'logGroups[*].logGroupName' --region $REGION --profile $PROFILE --output table | \
awk '{print $2}' | grep -v ^$ | while read x; do  echo "deleting $x" ; aws logs delete-log-group --log-group-name $x --region $REGION --profile $PROFILE; done
```
[source](https://gist.github.com/pahud/1e875cb1252a622173cc2236be5c2963)
