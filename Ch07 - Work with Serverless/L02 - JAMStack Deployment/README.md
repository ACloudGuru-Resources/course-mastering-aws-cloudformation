
## Deploy Backend & Frontend
```bash
yarn install
yarn build:backend
yarn deploy:backend \
  STAGE=feat-test \
  STAGE_FLAG=dev \
  REGION=us-east-1 \
  PROFILE=cloudguru \
  DEPLOY_BUCKET=acg-deploy-bucket \
  GITHUB_USER=iDVB
yarn build:frontend
yarn deploy:frontend \
  STAGE=feat-test \
  STAGE_FLAG=dev \
  REGION=us-east-1 \
  PROFILE=cloudguru
```
