
SERVICE = $(eval SERVICE := $(shell cut -d "=" -f 2 <<< $(shell npm run env | grep "npm_package_name")))$(SERVICE)
GIT_REPO = $(eval GIT_REPO := $(shell basename `git rev-parse --show-toplevel`))$(GIT_REPO)
GIT_BRANCH = $(eval GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD))$(GIT_BRANCH)
GIT_VERSION = $(eval GIT_VERSION := $(shell git rev-parse --short HEAD))$(GIT_VERSION)
DEPLOY_BUCKET := acg-deploy-bucket

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
		--parameter-overrides \
				Service=${SERVICE} \
				Stage=${STAGE} \
				StageFlag=${STAGE_FLAG} \
		--tags \
				SERVICE=${SERVICE} \
				GIT_BRANCH=${GIT_BRANCH} \
				GIT_REPOSITORY=${GIT_REPO}
	# sam deploy \
	# 	--template-file .aws-sam/build/template.yaml \
	# 	--stack-name '${STACK_NAME}' \
	# 	--s3-bucket '${DEPLOY_BUCKET}' \
	# 	--capabilities CAPABILITY_NAMED_IAM \
	# 	--no-fail-on-empty-changeset \
	# 	--parameter-overrides '\
	# 		ParameterKey=Service,ParameterValue=${SERVICE} \
	# 		ParameterKey=Stage,ParameterValue=${STAGE} \
	# 		ParameterKey=StageFlag,ParameterValue=${STAGE_FLAG}' \
	# 	--tags SERVICE=${SERVICE} GIT_REPOSITORY=${GIT_REPO} GIT_BRANCH=${GIT_BRANCH}


getenv: check-env
	@echo "Getting Stack Outputs..."
	node ./scripts/outputs \
		-s ${STACK_NAME} \
		-p REACT_APP_ \
		-i Stackname=${STACK_NAME} \
		-i Service=${SERVICE} \
		-i Stage=${STAGE} \
		-i StageFlag=${STAGE_FLAG} \
		-i GitVersion=${SERVICE} \
		-i SiteUrl \
		-i ServiceEndpointWebsocket \
		-o ../frontend/.env

check-env:
ifeq ($(call ifndef_any_of,STAGE STAGE_FLAG),)
	$(eval STACK_NAME=$(shell echo $(SERVICE)-$(STAGE)))
else
	$(error STAGE and STAGE_FLAG must be defined)
endif
