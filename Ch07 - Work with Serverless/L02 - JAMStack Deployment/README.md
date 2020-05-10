
## Build & Deploy JAMStack App

1) [Setup Admin Deployer User](#Setup-Admin-Deployer-User)
2) [Add AWS Key & Secret to GitHub Secrets](#Add-AWS-Key-&-Secret-to-GitHub-Secrets)
3) [Update Workflow Env Vars](#Update-Workflow-Env-Vars)
4) [Setup GitHub Workflow folder](#Setup-GitHub-Workflow-folder)
5) [Add Webhook to GitHub Repo](#Add-Webhook-to-GitHub-Repo)
6) [Create Feature Branch](#Create-Feature-Branch)

### Setup Admin Deployer User
Eg. `cloudguru-deployer`

### Add AWS Key & Secret to GitHub Secrets
Eg. `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`

### Update Workflow Env Vars
Eg. `TEMPLATE_LOCATION, DEPLOY_BUCKET, AWS_DEFAULT_REGION`

### Setup GitHub Workflow folder
`.github/workflows/main.yml`

### Add Webhook to GitHub Repo
- Get hook from StackProxy Outputs

### Create Feature Branch
Eg. `feat-test`


## Code Review
- [Backend Template](https://github.com/iDVB/course-mastering-aws-cloudformation/blob/800402a6840c6f6f66d6b396977270f2ea95e5c0/Ch07%20-%20Work%20with%20Serverless/L02%20-%20JAMStack%20Deployment/backend/template.yaml#L218-L223)
- [Embeded Git Hash](https://github.com/iDVB/course-mastering-aws-cloudformation/blob/800402a6840c6f6f66d6b396977270f2ea95e5c0/Ch07%20-%20Work%20with%20Serverless/L02%20-%20JAMStack%20Deployment/frontend/public/index.html#L2)
- [Outputs Script](https://github.com/iDVB/course-mastering-aws-cloudformation/blob/800402a6840c6f6f66d6b396977270f2ea95e5c0/Ch07%20-%20Work%20with%20Serverless/L02%20-%20JAMStack%20Deployment/backend/scripts/outputs.js#L7)
- [_redirects](https://github.com/iDVB/course-mastering-aws-cloudformation/blob/800402a6840c6f6f66d6b396977270f2ea95e5c0/Ch07%20-%20Work%20with%20Serverless/L02%20-%20JAMStack%20Deployment/frontend/public/_redirects#L2) + [middy-reroute](https://www.npmjs.com/package/middy-reroute)
- [SAM webpack plugin](https://github.com/iDVB/course-mastering-aws-cloudformation/blob/800402a6840c6f6f66d6b396977270f2ea95e5c0/Ch07%20-%20Work%20with%20Serverless/L02%20-%20JAMStack%20Deployment/backend/package.json#L15)
