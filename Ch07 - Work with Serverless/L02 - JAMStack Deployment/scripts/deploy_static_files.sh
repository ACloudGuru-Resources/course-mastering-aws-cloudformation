#!/bin/bash
set -eu

STACK="${1}"
echo "Querying Stack: ${STACK}..."

BUCKET_NAME=$(aws \
  cloudformation describe-stacks \
  --stack-name "${STACK}" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucket'] | [0].OutputValue" \
  --output text)

DISTRIBUTION_ID=$(aws \
  cloudformation describe-stacks \
  --stack-name "${STACK}" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'] | [0].OutputValue" \
  --output text)

echo "Deploying static assets to Bucket: ${BUCKET_NAME}..."

aws s3 sync ./build/ "s3://${BUCKET_NAME}/" --exclude "*.html" --cache-control 'max-age=31536000, public' --delete 
aws s3 sync ./build/ "s3://${BUCKET_NAME}/" --exclude "*" --include "*.html" --cache-control 'max-age=0, no-cache, no-store, must-revalidate' --content-type text/html --delete

echo "Deploy COMPLETE"

if [ "${DISTRIBUTION_ID}" != "None" ]; then
echo "Invalidating Cloudfront Distro: ${DISTRIBUTION_ID}..."
aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"
else
echo "No Cloudfront Distro to invalidate."
fi