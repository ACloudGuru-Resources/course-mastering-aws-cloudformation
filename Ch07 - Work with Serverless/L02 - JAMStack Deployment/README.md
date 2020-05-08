


### Setup GitHub Workflow folder
`.github/workflows/main.yml`

### Update Workflow Env Vars
Eg. `TEMPLATE_LOCATION, DEPLOY_BUCKET, AWS_DEFAULT_REGION`

### Add AWS Key & Secret to GitHub Secrets
Eg. `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`


## Deploy Backend & Frontend
```bash
yarn install
yarn build:backend
yarn deploy:backend \
  STAGE=feat-other \
  STAGE_FLAG=dev \
  REGION=us-east-1 \
  PROFILE=cloudguru \
  DEPLOY_BUCKET=acg-deploy-bucket
yarn build:frontend
yarn deploy:frontend \
  STAGE=feat-test \
  STAGE_FLAG=dev \
  REGION=us-east-1 \
  PROFILE=cloudguru
```
