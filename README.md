# acg-mastering-cloudformation

A Cloud Guru Course: Mastering CloudFormation

## Chapter 1 - Intro and Theory (~56:00)

### Ch01_L01 – Introduction (?)

*Lecture Description:* Gain a high-level look at what this course has to offer. We’ll also give some tips for how to work thru it.

### Ch01_L02 – A Quick Refresher (15:24)

1. DEMO: Working with the AWS CLI
2. How CloudFormation works
3. How to efficiently search and read the docs
   - Properties
   - Return Values (Ref, Fn::GetAtt)
4. DEMO: Finding Resource documentation


### Ch01_L03 – Template Anatomy (12:17)

1. Parameters
   - [Constraints](http://bit.ly/2YyuvjE)
   - AWS-Specific Parameter Types
2. Mappings
3. Conditions
4. Metadata
5. Resources
6. Outputs

### Ch01_L04 – Template Operations (10:15)

1. Intrinsic Functions
   - Ref, GetAtt
2. Export/Imports Outputs


### Ch01_L05 – Tips & Watchouts (18:45)

1. Trick-out your IDE
2. Lambda@Edge Deletion Times
3. CloudFront Propagation Times
4. Stack Creation Manual Steps
5. Renaming Things
6. Stateful Resources and Updates / Deletes
7. [Limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)
https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html


## Chapter 2 - Custom Resources (~59:00)

**Lecture Description:** Learn to create, deploy and implement custom resources that can help extend native CloudFormation resources.
**Demo Description:** Create and use a custom resource that provisions unique subdomains and routing based on application version.
Eg. feat-blue--projectx.domain.com

### Ch02_L01 – Overview (10:23)

1. What they are
   - Lambda: Create, Update, Delete
   - Return & Fn::GetAtt
2. Features & Use Cases
3. Limits

### Ch02_L02 – What We Are Building (07:22) 

1. Important Notes
   - Timeouts & Catching Errors
   - How CloudFormation identifies and replaces resources
   - Design functions for idempotency
2. Helper Libraries
3. Diagram: What We Are Building

### Ch02_L02 – Let's Make one (19:28)

1. DEMO: Create/Deploy Custom Resource
2. DEMO: Review Custom Resource Function
3. DEMO: Review Exports in Console

### Ch02_L03 – Let's Use It (10:58)

1. Using in another Template
2. DEMO: Create, Update and Delete
3. DEMO: Cleanup

## Chapter 3 - Macros & Transforms (?)

**Lecture Description:** Amplify your template functionality with Macros and Transforms. Learn to create and use custom template functions.

### Ch03_L01 – Overview (11:22)

1. What they are
2. Snippet vs Template-Level
3. Features & Use Cases
4. Limits

### Ch03_L02 – Macro: String Operations (09:35)

1. What We're Building
  - String Operations (Capitalize, Replace, Max Length)
2. DEMO: Create/Deploy String Operations Macro
  - Show CFN console view processed template http://bit.ly/32GrwIn
3. DEMO: Use Macro

### Ch03_L03 – Macro: Common Tags (08:21)

1. What We're Building
2. DEMO: Create/Deploy CommonTags Macro
3. DEMO: Use Macro

### Ch03_L04 – Macro: Custom Resource Types (17:01)

1. What We're Building
2. DEMO: Create/Deploy S3Objects Macro
3. DEMO: Use Macro

### Ch03_L05 – Unit Testing (?)
1. Unit Testing
2. DEMO: Setting up Macro Unit Tests
  - validate-template

## Chapter 4 – Best Practises

### Ch04_L01 - Nested Stacks

1. What are they?
3. Features & Benefits
2. Use Case
3. DEMO - Let's Build One
4. Passing Params to/from Parent and Child Stacks 
4. Recover a nested stacks hierarchy with ResourcesToSkip https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html#nested-stacks
5. Clean up

### Ch04_L02 - Working with Secrets

1. Overview
2. SSM vs Secrets Manager
2. Intro to KMS
4. Bundling Secrets
3. Encrypting in CLI
4. Decrypting in Lambda
5. Clean up

### Ch04_L03 - Template Strategies

**Lecture Description:** Learn some of the best practises, workflows and tools for managing your templates
https://amzn.to/32Gkl36

1. Reuse & Stack Separation
3. Organize Stacks By Lifecycle and Ownership
4. Nested vs Exports vs AWS::Include
5. Validate Templates before deploying

### Ch04_L04 - Template Storage and Revisions

1. Storing and Managing Templates
2. AWS Serverless Application Repository

## Chapter 5 - Mastering Stacks

**Lecture Description:** Learn processes to create fast and reliable CI pipelines for your CloudFormation templates

### Ch05_L01 - CloudFormation Service Roles
http://bit.ly/2YL0yND

1. Why are they needed?
2. DEMO: User & Role Setup
3. DEMO: Stack Deploy & Update
4. Cleanup


### Ch05_L02 – Change Sets
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html#organizingstacks

1. What are they
2. Use Case
3. Stack Drift
4. DEMO - Let's use one
5. Cleanup

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
3. cfn-init and [cfn-signal](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-signal.html)

### Ch06_L03 - Stack Policies

1. What are they?
2. DEMO - Creation Policy
4. DEMO - Deletion Policy

### Ch06_L04 – Deploy & Review

1. DEMO - Deploying the Stack
2. DEMO - Reviewing the CloudFormation Console
3. Cleanup

## Chapter 7 - Working with Serverless

### Ch07_L05 – Serverless CI/CD Deployment Pipeline

**Demo Description:** Build a serverless and real-time voting platform with API Gateway sockets and DynamoDB.

1. What we’re going to build
2. Review Template & Code
3. Outputs injection
3. Deleting S3 assets as part of stack delete

### Ch05_L06 – JAMStack Deployment (Voting App)

1. What we’re going to build
2. Review Template & Code
3. Outputs injection
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
- [Blue/Green Deploys](http://think-devops.com/blogs/blue-green-deployments.html)


# Timelines

- Chapter 1 - Intro and Theory (~56:00)
  - Ch01_L01 – Introduction (?)
  - Ch01_L02 – A Quick Refresher (15:24)
  - Ch01_L03 – Template Anatomy (12:17)
  - Ch01_L04 – Template Operations (10:15)
  - Ch01_L05 – Tips & Watchouts (18:45)
- Chapter 2 - Custom Resources (~59:00)
  - Ch02_L01 – Overview (10:23)
  - Ch02_L02 – What We Are Building (07:22)
  - Ch02_L02 – Let's Make one (19:28)
  - Ch02_L03 – Let's Use It (10:58)
- Chapter 3 - Macros & Transforms (?)
  - Ch03_L01 – Overview (11:22)
  - Ch03_L02 – Macro: String Operations (?)
  - Ch03_L03 – Macro: Cloning Resources (?)
  - Ch03_L04 – Macro: Custom Resource Types (?)
  - Ch03_L05 – Unit Testing (?)

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
  
- Setup of main deploy bucket in overview of course
- setup yarn shortcut to install all node modules
- Remove statement about using cfn-lambda as module
- Add Blue-Green Deployment of CloudFormation Templates (Domains)
