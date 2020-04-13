
WEBSITE_BUCKET = $(eval WEBSITE_BUCKET := $(call getBucket))$(WEBSITE_BUCKET)
DISTRIBUTION_ID = $(eval DISTRIBUTION_ID := $(call getDistroID))$(DISTRIBUTION_ID)


deploy: syncS3

syncS3:
	@echo "Syncing to S3 Bucket: $(WEBSITE_BUCKET) ..."
	aws s3 sync ./build/ "s3://$(WEBSITE_BUCKET)/" --exclude "*.html" --cache-control 'max-age=31536000, public' --delete 
	aws s3 sync ./build/ "s3://$(WEBSITE_BUCKET)/" --exclude "*" --include "*.html" --cache-control 'max-age=0, no-cache, no-store, must-revalidate' --content-type text/html --delete

invalidate:
	@echo "Invalidating Cloudfront Cache on: $(DISTRIBUTION_ID) ..."
	aws cloudfront create-invalidation \
		--distribution-id $(DISTRIBUTION_ID) \
		--paths "/*"

check-env:
ifneq ($(call ifndef_any_of,STACK_NAME),)
	$(error STACK_NAME must be defined)
endif

ifndef_any_of = $(filter undefined,$(foreach v,$(1),$(origin $(v))))
ifdef_any_of = $(filter-out undefined,$(foreach v,$(1),$(origin $(v))))

getBucket = $(shell aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--query "Stacks[0].Outputs[?OutputKey=='WebsiteBucket'] | [0].OutputValue" \
		--output text)

getDistroID = $(shell aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--query "Stacks[0].Outputs[?OutputKey=='DistributionId'] | [0].OutputValue" \
		--output text)








# STACK="${1}"
# echo "Querying Stack: ${STACK}..."

# WEBSITE_BUCKET=$(aws \
#   cloudformation describe-stacks \
#   --stack-name "${STACK}" \
#   --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucket'] | [0].OutputValue" \
#   --output text)

# DISTRIBUTION_ID=$(aws \
#   cloudformation describe-stacks \
#   --stack-name "${STACK}" \
#   --query "Stacks[0].Outputs[?OutputKey=='DistributionId'] | [0].OutputValue" \
#   --output text)

# echo "Deploying static assets to Bucket: ${WEBSITE_BUCKET}..."

# aws s3 sync ./public/ "s3://${WEBSITE_BUCKET}/" --exclude "*.html" --cache-control 'max-age=31536000, public' --delete 
# aws s3 sync ./public/ "s3://${WEBSITE_BUCKET}/" --exclude "*" --include "*.html" --cache-control 'max-age=0, no-cache, no-store, must-revalidate' --content-type text/html --delete

# echo "Deploy COMPLETE"

# if [ "${DISTRIBUTION_ID}" != "None" ]; then
# echo "Invalidating Cloudfront Distro: ${DISTRIBUTION_ID}..."
# aws configure set preview.cloudfront true
# aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"
# else
# echo "No Cloudfront Distro to invalidate."
# fi
