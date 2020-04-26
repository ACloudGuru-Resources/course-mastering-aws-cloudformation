SHELL := /bin/bash
.ONESHELL:

SERVICE = $(eval SERVICE := $(shell cut -d "=" -f 2 <<< $(shell cd ../backend && npm run env | grep "npm_package_name")))$(SERVICE)
WEBSITE_BUCKET = $(eval WEBSITE_BUCKET := $(call getBucket))$(WEBSITE_BUCKET)
DISTRIBUTION_ID = $(eval DISTRIBUTION_ID := $(call getDistroID))$(DISTRIBUTION_ID)

profile = $(if $(PROFILE:-=),--profile $(PROFILE),)

deploy: check-env syncS3 invalidate

syncS3:
	@echo "Deploying Frontend for Stack $(STACK_NAME)"
	@echo "Syncing to S3 Bucket: $(WEBSITE_BUCKET) ..."
	aws s3 sync ./build/ "s3://$(WEBSITE_BUCKET)/" \
		--exclude "*.html" \
		--cache-control 'max-age=31536000, public' \
		--delete \
		--region '${REGION}' \
		$(profile)
	aws s3 sync ./build/ "s3://$(WEBSITE_BUCKET)/" \
		--exclude "*" --include "*.html" \
		--cache-control 'max-age=0, no-cache, no-store, must-revalidate' \
		--content-type text/html \
		--delete \
		--region '${REGION}' \
		$(profile)

invalidate:
ifeq (${DISTRIBUTION_ID},"None")
	@echo "Invalidating Cloudfront Distro: ${DISTRIBUTION_ID}..."
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation \
		--distribution-id $(DISTRIBUTION_ID) \
		--paths "/*" \
		--region '${REGION}' \
		$(profile)
else
	@echo "No Cloudfront Distro to invalidate."
endif

check-env:
ifeq ($(call ifndef_any_of,STAGE STAGE_FLAG REGION),)
	$(eval STACK_NAME=$(shell echo $(SERVICE)-$(STAGE)))
else
	$(error STAGE, STAGE_FLAG, and REGION must be defined)
endif

ifndef_any_of = $(filter undefined,$(foreach v,$(1),$(origin $(v))))
ifdef_any_of = $(filter-out undefined,$(foreach v,$(1),$(origin $(v))))

getBucket = $(shell aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--query "Stacks[0].Outputs[?OutputKey=='WebsiteBucket'] | [0].OutputValue" \
		--output text \
		--region '${REGION}' \
		$(profile))

getDistroID = $(shell aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--query "Stacks[0].Outputs[?OutputKey=='DistributionId'] | [0].OutputValue" \
		--output text \
		--region '${REGION}' \
		$(profile))
