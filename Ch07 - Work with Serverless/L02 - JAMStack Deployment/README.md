
## Build & Deploy JAMStack App

1) [Setup Admin Deployer User](#Setup-Admin-Deployer-User)
2) [Add AWS Key & Secret to GitHub Secrets](#Add-AWS-Key-&-Secret-to-GitHub-Secrets)
3) [Setup GitHub Workflow folder](#Setup-GitHub-Workflow-folder)
4) [Update Workflow Env Vars](#Update-Workflow-Env-Vars)
5) [Deploy Backend & Frontend](#Deploy-Backend-&-Frontend)

### Setup Admin Deployer User
Eg. `cloudguru-deployer`

### Add AWS Key & Secret to GitHub Secrets
Eg. `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`

### Setup GitHub Workflow folder
`.github/workflows/main.yml`

### Update Workflow Env Vars
Eg. `TEMPLATE_LOCATION, DEPLOY_BUCKET, AWS_DEFAULT_REGION`
