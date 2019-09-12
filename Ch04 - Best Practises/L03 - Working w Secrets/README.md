
## Encrypt Secret for Single Account
```
clear
aws kms encrypt \
  --key-id KEY_ARN_1_HERE \
  --plaintext file://secrets.json \
  --query CiphertextBlob \
  --output text \
  --profile cloudguru
```

## Encrypt Secrets for Dev and Prod enviroments
```
clear
echo "-------------DEV--------------"
aws kms encrypt \
  --key-id KEY_ARN_1_HERE \
  --plaintext file://secrets.json \
  --query CiphertextBlob \
  --output text \
  --profile cloudguru-dev
echo "-------------------------------"
echo "-------------PROD--------------"
aws kms encrypt \
  --key-id KEY_ARN_2_HERE \
  --plaintext file://secrets.json \
  --query CiphertextBlob \
  --output text \
  --profile cloudguru-prod
echo "-------------------------------"
```
