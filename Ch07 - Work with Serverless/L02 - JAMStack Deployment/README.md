
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
