****# acg-mastering-cloudformation

A Cloud Guru Course: Mastering CloudFormation

## Chapter 1 - Intro and Theory

### Ch01_L01 – Introduction

*Lecture Description:* Gain a high-level look at what this course has to offer. We’ll also give some tips for how to work thru it.

### Ch01_L02 – A Quick Refresher

1. DEMO: Working with the AWS CLI
2. How CloudFormation works
3. How to efficiently search and read the docs
   - Properties
   - Return Values (Ref, Fn::GetAtt)
4. DEMO: Finding Resource documentation

### Ch01_L03 – Tips & Watchouts

1. Trick-out your IDE
2. Lambda@Edge Deletion Times
3. CloudFront Propagation Times
4. Stack Creation Manual Steps
5. Renaming Things
6. Stateful Resources and Updates / Deletes
7. [Limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)

### Ch01_L04 – Template Anatomy Refresher

1. Parameters
   - [Constraints](http://bit.ly/2YyuvjE)
   - AWS-Specific Parameter Types
2. Mappings
3. Conditions
4. Metadata
5. Resources
6. Outputs

### Ch01_L05 – Template Operations

1. Intrinsic Functions
   - Ref, GetAtt
2. Export/Imports Outputs

## Chapter 2 - Custom Resources

**Lecture Description:** Learn to create, deploy and implement custom resources that can help extend native CloudFormation resources.
**Demo Description:** Create and use a custom resource that provisions unique subdomains and routing based on application version.
Eg. feat-blue--projectx.domain.com

### Ch02_L01 – Overview

1. What they are
   - Lambda: Create, Update, Delete
   - Return & Fn::GetAtt
2. Features & Use Cases
3. Limits

### Ch02_L02 – Let's Make one

1. Tips & Tricks
   - Timeouts & Catching Errors
   - How CloudFormation identifies and replaces resources
   - Design functions for idempotency
2. Helpers Libraries
3. Diagram: What We're Building
4. DEMO: Create/Deploy Template

### Ch02_L03 – Let's Use It

1. Use Custom Resource in another Template
2. DEMO: Create, Update and Delete
3. DEMO: Cleanup

## Chapter 3 - Macros & Transforms

**Lecture Description:** Amplify your template functionality with Macros and Transforms. Learn to create and use custom template functions.

### Ch03_L01 – Overview

1. What they are
2. Snippet vs Template-Level
3. Features & Use Cases
4. Limits

### Ch03_L02 – Let's Build Some Macros!

1. String Operations (Capitalize, Replace, Max Length)
2. DEMO: String Operations Macro
   1. Show CFN console view processed template http://bit.ly/32GrwIn
3. Count
4. DEMO: Count Macro
5. S3Objects
6. DEMO: S3Objects Macro
7. Unit Testing
8. DEMO: Setting up Macro Unit Tests
   1. validate-template

## Chapter 4 – Best Practises for Template/Stack Management

### Ch04_L01 - Template / Stack Reuse

**Lecture Description:** Learn some of the best practises, workflows and tools for managing your templates

https://amzn.to/32Gkl36

1. Reuse & Stack Separation
2. Git Template Repository
3. DEMO - Clone Course Repository
4. Stack Policies and Temporary Policies
5. AWS Serverless Application Repository

### Ch04_L02 - Nesting & Referencing Templates

1. AWS::Include Transform
2. Nested Stacks vs Cross-Stack Referencing
3. Features & Benefits
4. Limitations
5. DEMO - Nested Stacks
6. DEMO - Cross-Stack Referencing
7. Recover a nested stacks hierarchy with ResourcesToSkip

## Chapter 5 - Mastering Deployments

**Lecture Description:** Learn processes to create fast and reliable CI pipelines for your CloudFormation templates

### Ch05_L01 – Overview

1. What we’re going to Build/Learn
2. Resources to be used

### Ch05_L02 – Serverless CI/CD Deployment Pipeline

1. How does a pipeline work?
2. [CloudFormation Service Roles](http://bit.ly/2YL0yND)
3. DEMO - Deploying Pipeline Stack (Code Pipeline/Code Build)

### Ch05_L03 – StackSets

1. StackSet Concepts
2. Features & Benefits
3. Limitations
4. Granting permissions for Stack Set operations
5. Configuring a target account gate
6. DEMO - Deploying with StackSets
7. Cleanup

## Chapter 6 - Working with EC2 Instances (eg. GhostCMS)

**Demo Description:** Build and deploy a Ghost Blogging CMS hosted on EC2. Learn how to provision the instance for required packages with CloudFormation.

### Ch06_L01 – Overview

1. What we’re going to Build/Learn
2. Resources to be used

### Ch06_L02 – Provisioning

1. [UserData (Procedural)](https://acloud.guru/course/aws-advanced-cloudformation/learn/d8067ef9-7840-7c93-e19e-6e1d9a52d756/e72173eb-7bbe-7db7-0d7c-eb486ba6e6f6/watch?backUrl=~2Fcourses)
2. CloudFormationInit (Desired State)
3. [cfn-signal](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-signal.html)

### Ch06_L03 - Creation/Deletion Policies

1. Creation Policy Overview
2. DEMO - Creation Policy
3. Deletion Policy Overview
4. DEMO - Deletion Policy

### Ch06_L04 – Deploy & Review

1. DEMO - Deploying the Stack
2. DEMO - Reviewing the CloudFormation Console
3. Cleanup

## Chapter 7 - Building for Serverless (Real-time Voting App)

**Demo Description:** Build a serverless and real-time voting platform with API Gateway sockets and DynamoDB.

### Ch07_L01 – Overview

1. What we’re going to build
2. What we’ll learn
3. Resources to be used

### Ch07_L02 – Code Review

1. Review Template & Code
2. Outputs injection
3. Options for deploying assets to S3

### Ch07_L03 – Deploy and Review

1. Testing the app
2. Review the console
3. Deleting S3 assets as part of stack delete

## Chapter 8 - Putting it all together (Self Service Portal)

**Demo Description:** Learn how you can use the AWS SDK programmatically to handle deployments for your templates, securely exposing this two your users.

### Ch08_L01 – Overview

1. What we’re going to build
2. What we’ll learn
3. Resources to be used

### Ch08_L02 – Deploy & Review

1. Review Template
2. Deploy
3. Setup Google API App
4. Review the CloudFormation Console

### Ch08_L03 - Demo the Portal

1. Customer Portal Login
2. Provisioning Stack
3. Updating Stack
4. Deleting Stack

### Ch08_L04 - Clean up

1. Deleting Portal Stack
2. Deleting Google App

## Chapter 9 - Other Tools

**Lecture Description:** Simply your workflow with a CloudFormation based CLI tool. We’ll briefly review and compare a number of industry tool options.

### Ch9_L01 – Serverless Framework

1. Intro
2. Features
3. Example Template

### Ch9_L02 – AWS SAM

1. Intro
2. Features
3. Example Template

### Ch9_L03 – Troposphere

1. Intro
2. Features
3. Example Template

### Ch9_L04 – AWS CDK

1. Intro
2. Features
3. Example Template

## Chapter 10 - Challenge

**Demo Description:** Put your CloudFormation knowledge to the test by creating a template that deploys a serverless website and uses a Macro to ensure the CDN has a standard WAF on it. (site code provided)

### Ch10_L01 – Build a Serverless Website & API

1. Discuss Goal
2. Options Review

### Ch10_L02 – Solution Review

1. Possible Solution Review
   - Template
   - Code

## Links

- [aws-cf-templates](https://github.com/widdix/aws-cf-templates)
- [aws-cloudformation-templates](https://github.com/awslabs/aws-cloudformation-templates)
- [Limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)
- [IDE Tips](https://hodgkins.io/up-your-cloudformation-game-with-vscode)
- [New Parameter Types](https://aws.amazon.com/blogs/devops/using-the-new-cloudformation-parameter-types/)
- [Custom Resource Auto-approve cert](https://www.alexdebrie.com/posts/cloudformation-custom-resources/)
- [Macro Ideas](https://www.alexdebrie.com/posts/cloudformation-macros/)




## Missing Topics
- CFN Designer
- DependsOn
- Tags
- Replacement update behavior (http://bit.ly/31liOh8)
- UpdateReplace Policies
- DeletionPolicy
- Stack Policies


## Edits
- Template Operations
  - Conditionals !And is not used in example
  - all code examples need to wipe in
  - !Split UsualSuspectsParam instead of UsualSuspects:
  