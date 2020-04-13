#!/bin/bash
set -eu

STACK="${1}"
echo "Deleting static assets from: ${STACK}..."

BUCKET_NAME=$(aws \
  cloudformation describe-stacks \
  --stack-name "${STACK}" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucket'] | [0].OutputValue" \
  --output text)

mkdir /tmp/empty

aws s3 sync --delete /tmp/empty/ "s3://${BUCKET_NAME}/"

rmdir /tmp/empty

echo "Bucket ${BUCKET_NAME} has been emptied"