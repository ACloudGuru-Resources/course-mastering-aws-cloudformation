
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

