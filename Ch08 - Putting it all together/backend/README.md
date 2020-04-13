
```bash
REGION=us-east-1
PROFILE=cloudguru
sam local invoke \
  -t .aws-sam/build/template.yaml \
  -n tests/github/env.json \
  -e tests/github/branches.json \
  --region $REGION \
  --profile $PROFILE \
  LambdaGithub
```
