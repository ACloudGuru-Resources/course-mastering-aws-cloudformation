
EXPIRES = $(eval EXPIRES := $(shell echo $$(($$(date +%s) + 15552000))))$(EXPIRES) # 6 months from today
SERVICE = $(eval SERVICE := $(shell cut -d "=" -f 2 <<< $(shell npm run env | grep "npm_package_name")))$(SERVICE)
GIT_REPO = $(eval GIT_REPO := $(shell basename `git rev-parse --show-toplevel`))$(GIT_REPO)
GIT_BRANCH = $(eval GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD))$(GIT_BRANCH)
GIT_SHORT = $(eval GIT_SHORT := $(shell git rev-parse --short HEAD))$(GIT_SHORT)

ifndef_any_of = $(filter undefined,$(foreach v,$(1),$(origin $(v))))
ifdef_any_of = $(filter-out undefined,$(foreach v,$(1),$(origin $(v))))

deploy: check-env
	@echo "Deploying Service..."
	aws cloudformation package \
		--template-file .aws-sam/build/template.yaml \
		--s3-bucket ${DEPLOY_BUCKET} \
		--output-template-file .aws-sam/build/packaged.yaml
	aws cloudformation deploy \
		--template .aws-sam/build/packaged.yaml \
		--stack-name ${STACK_NAME} \
		--capabilities CAPABILITY_NAMED_IAM \
		--no-fail-on-empty-changeset \
		--parameter-overrides \
				GitHubUser=${GITHUB_USER} \
				APIKeyExpires=${EXPIRES} \
		--region '${REGION}' \
		--profile '${PROFILE}' \
		--tags \
				SERVICE=${SERVICE} \
				STAGE=${STAGE} \
				STAGE_FLAG=${STAGE_FLAG} \
				GIT_BRANCH=${GIT_BRANCH} \
				GIT_REPOSITORY=${GIT_REPO} \
				GIT_SHORT=${GIT_SHORT}

# https://github.com/awslabs/aws-sam-cli/issues/1845#issuecomment-612512744
# sam deploy \
# 	--template-file .aws-sam/build/template.yaml \
# 	--stack-name '${STACK_NAME}' \
# 	--s3-bucket '${DEPLOY_BUCKET}' \
# 	--capabilities CAPABILITY_NAMED_IAM \
# 	--no-fail-on-empty-changeset \
# 	--parameter-overrides '\
# 		ParameterKey=GitHubUser,ParameterValue=${GITHUB_USER}'
# 	--region '${REGION}' \
# 	--profile '${PROFILE}'

getenv: check-env
	@echo "Getting Stack Outputs..."
	node ./scripts/outputs \
		-s ${STACK_NAME} \
		-r ${REGION} \
		-p ${PROFILE} \
		-x GATSBY_ \
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
ifeq ($(call ifndef_any_of,STAGE STAGE_FLAG REGION PROFILE DEPLOY_BUCKET GITHUB_USER),)
	$(eval STACK_NAME=$(shell echo $(SERVICE)-$(STAGE)))
else
	$(error STAGE, STAGE_FLAG, REGION, PROFILE, DEPLOY_BUCKET and GITHUB_USER must be defined)
endif
