
SERVICE = $(eval SERVICE := $(shell cut -d "=" -f 2 <<< $(shell npm run env | grep "npm_package_name")))$(SERVICE)
GIT_VERSION = $(eval GIT_VERSION := $(shell git rev-parse --short HEAD))$(GIT_VERSION)
DEPLOY_BUCKET := acg-deploy-bucket
REGION := us-east-1
PROFILE := cloudguru

ifndef_any_of = $(filter undefined,$(foreach v,$(1),$(origin $(v))))
ifdef_any_of = $(filter-out undefined,$(foreach v,$(1),$(origin $(v))))

deploy: check-env
	@echo "Deploying Service..."
	sam deploy \
		--template-file .aws-sam/build/template.yaml \
		--stack-name '${STACK_NAME}' \
		--s3-bucket '${DEPLOY_BUCKET}' \
		--capabilities CAPABILITY_NAMED_IAM \
		--no-fail-on-empty-changeset \
		--parameter-overrides '\
			ParameterKey=GitHubUser,ParameterValue=${GITHUB_USER}'
		--region '${REGION}' \
		--profile '${PROFILE}'

getenv: check-env
	@echo "Getting Stack Outputs..."
	node ./scripts/outputs \
		-s ${STACK_NAME} \
		-p GATSBY_ \
		-i Stackname=${STACK_NAME} \
		-i Service=${SERVICE} \
		-i Stage=${STAGE} \
		-i StageFlag=${STAGE_FLAG} \
		-i GitVersion=${SERVICE} \
		-i AwsRegion=${REGION} \
		-i APIKey \
		-i GraphQL \
		-o ../frontend/.env

check-env:
ifeq ($(call ifndef_any_of,STAGE STAGE_FLAG GITHUB_USER),)
	$(eval STACK_NAME=$(shell echo $(SERVICE)-$(STAGE)))
else
	$(error STAGE, STAGE_FLAG, PROFILE and GITHUB_USER must be defined)
endif
