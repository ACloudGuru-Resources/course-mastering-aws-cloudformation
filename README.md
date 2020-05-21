# acg-mastering-cloudformation

A Cloud Guru Course: Mastering CloudFormation

## Chapter 1 - Intro and Theory
*Everything you need to set you up for a successful course. We'll quickly cover some tips when working with the AWS CLI. We'll then cover a brief review of the CloudFormation template anatomy including metadata, intrinsic functions, as well as exporting and importing values between templates.*

### Ch01_L01 – Introduction
*Take a high-level look at what this course has to offer.*

### Ch01_L02 – A Quick Refresher
*A quick refresher on AWS CLI, CloudFormation fundenmentals, and navigating the AWS CloudFormation Docs.*

1. DEMO: Working with the AWS CLI
2. How CloudFormation works
3. How to efficiently search and read the docs
   - Properties
   - Return Values (Ref, Fn::GetAtt)
4. DEMO: Finding Resource documentation


### Ch01_L03 – Template Anatomy
*A complete look at CloudFormation's template anatomy, with Parameters/Types, Mappings, Conditions, Metadata, Resources, Outputs and more.*

1. Parameters
   - [Constraints](http://bit.ly/2YyuvjE)
   - AWS-Specific Parameter Types
2. Mappings
3. Conditions
4. Metadata
5. Resources
6. Outputs

### Ch01_L04 – Template Operations
*A detailed look at intrinsic functions as well as a deep dive on Exporting and Importing values between templates.*

1. Intrinsic Functions
   - Ref, GetAtt
2. Export/Imports Outputs


### Ch01_L05 – Tips & Watchouts
*A list of the most common CloudFormation pitfalls as well how to best setup your code editor, when working with CloudFormation.*

1. Trick-out your IDE
2. Lambda@Edge Deletion Times
3. CloudFront Propagation Times
4. Stack Creation Manual Steps
5. Renaming Things
6. Stateful Resources and Updates / Deletes
7. [Limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)
https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html


## Chapter 2 - Custom Resources
*Learn to create, deploy and implement custom resources that can help extend CloudFormation way beyond just native resources.*

**Demo Description:** Create and use a custom resource that provisions unique subdomains and routing based on application version.
Eg. feat-blue--projectx.domain.com

### Ch02_L01 – Overview
*A birds-eye view of Custom Resources; what they are and various use cases.*

1. What they are
   - Lambda: Create, Update, Delete
   - Return & Fn::GetAtt
2. Features & Use Cases
3. Limits

### Ch02_L02 – What We Are Building 
*A detailed walk-through of the custom resource you will be building; as well as calling out a few custom resource helper libraries.*

1. Important Notes
   - Timeouts & Catching Errors
   - How CloudFormation identifies and replaces resources
   - Design functions for idempotency
2. Helper Libraries
3. Diagram: What We Are Building

### Ch02_L03 – Let's Make one
*A guided jounery in building your own custom resource, and how to deploy it.*

1. DEMO: Create/Deploy Custom Resource
2. DEMO: Review Custom Resource Function
3. DEMO: Review Exports in Console

### Ch02_L04 – Let's Use It
*A complete guide to implementing and using your new custom resource*

1. Using in another Template
2. DEMO: Create, Update and Delete
3. DEMO: Cleanup

## Chapter 3 - Macros & Transforms
*Elevate your template functionality with Macros and Transforms. Learn to create and use custom template functions.*

### Ch03_L01 – Overview
*A comprehensive look at Macros & Transforms; along with various use cases and limits.*

1. What they are
2. Snippet vs Template-Level
3. Features & Use Cases
4. Limits

### Ch03_L02 – Macro: String Operations
*A hands-on lab where you will be building a deploying a Macro that is able to perform string manipulations in your templates.*

1. What We're Building
  - String Operations (Capitalize, Replace, Max Length)
2. DEMO: Create/Deploy String Operations Macro
  - Show CFN console view processed template http://bit.ly/32GrwIn
3. DEMO: Use Macro

### Ch03_L03 – Macro: Common Tags
*A hands-on lab where you will be building a deploying a Macro that cleanly provides a way to globally tag all the resources at once.*

1. What We're Building
2. DEMO: Create/Deploy CommonTags Macro
3. DEMO: Use Macro

### Ch03_L04 – Macro: Custom Resource Types
*A hands-on lab where you will build & deploy a Macro that abstracts away your custom resource, making it appear as though it's a native resource type.*

1. What We're Building
2. DEMO: Create/Deploy S3Objects Macro
3. DEMO: Use Macro

### Ch03_L05 – Unit Testing
*Learn to debug and test your Lambda's locally, or as part of a deployment step.*

1. Unit Testing
2. DEMO: Setting up Macro Unit Tests
  - validate-template

## Chapter 4 – Best Practices
*A focused look at the most impactful CloudFormation features, workflows and best practices for organizing, securing and managing your templates and stacks.*

### Ch04_L01 - Nested Stacks
*An advanced exploration of Nested Stacks; how they work, use cases, features and a detailed hands-on demo.*

1. What are they?
3. Features & Benefits
2. Use Case
3. DEMO - Let's Build One
4. Passing Params to/from Parent and Child Stacks 
4. Recover a nested stacks hierarchy with ResourcesToSkip https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html#nested-stacks
5. Clean up

### Ch04_L02 - Working with Secrets
*An extensive look at safe-guarding your secrets when working with CloudFormation without compromising on workflow or security.*

1. Overview
2. SSM vs Secrets Manager
2. Intro to KMS
4. Bundling Secrets
3. Encrypting in CLI
4. Decrypting in Lambda
5. Clean up

### Ch04_L03 - Template Strategies
*A detailed examination of various techniques, workflows and tools for validating, cross-referencing, and orginizing your templates.*

1. Reuse & Stack Separation
3. Organize Stacks By Lifecycle and Ownership
4. Nested vs Exports vs AWS::Include
5. Validate Templates before deploying
  - https://github.com/aws-cloudformation/cfn-python-lint#basic-usage
  - https://github.com/ScottBrenner/cfn-lint-action

### Ch04_L04 - Template Storage and Revisions
*A practical look at a variety of approaches to automating the tasks of versioning, linting, packaging, storing and continuously deploying your templates.*

1. Versioning
2. Linting
3. Packaging
4. Storing
5. Automated CI/CD Pipeline

## Chapter 5 - Mastering Stacks
*A comprehensive review of some of the lesser known, but extremely powerful CloudFormation features.*

### Ch05_L01 - Service Roles
*A guided investigation of service roles; what they are and the granular control over stacks they provide.*

1. Why are they needed?
2. DEMO: User & Role Setup
3. DEMO: Stack Deploy & Update
4. Cleanup

### Ch05_L02 – Change Sets
*An exploration of Change Sets; what they are, some powerful use cases along with a hands-on demo on how to take full advantage of them when you deploy.*

1. What are they
2. Use Case
3. Stack Drift
4. DEMO - Let's use one
5. Cleanup

### Ch05_L03-L04 – StackSets
*An in-depth look at stack sets; some of their most important benefits and limitations as well as a hands-on demo of how they can help you master mult-region and account deploys.*

1. StackSet Concepts
2. Features & Benefits
3. Limitations
4. Granting permissions for Stack Set operations
5. Configuring a target account gate
6. DEMO - Deploying with StackSets
7. Cleanup

### Ch05_L05 – Stack Policies
*Learn how to completely protect your stack resources, with ease using stack policies.*

1. What are they?
2. DEMO: Using Stack Policies
3. Cleanup

## Chapter 6 - Working with EC2 Instances (eg. GhostCMS)
*Learn how to provision your EC2 instances complete with all required services, files, users, and groups all with native CloudFormation.*

**Demo Description:** Build and deploy a Ghost Blogging CMS hosted on EC2. Learn how to provision the instance for required packages with CloudFormation.

### Ch06_L01 – CloudFormationInit
*Learn about CloudFormationInit and how it can orgistrate your EC2 application provisioning.*

1. [UserData (Procedural)](https://acloud.guru/course/aws-advanced-cloudformation/learn/d8067ef9-7840-7c93-e19e-6e1d9a52d756/e72173eb-7bbe-7db7-0d7c-eb486ba6e6f6/watch?backUrl=~2Fcourses) vs CloudFormationInit
2. How it Works
3. Provisioning Workflow

### Ch06_L02 - ConfigSets
*Explore ConfigSets and how they offer declaritive control over the services, files, users, and groups that get installed on your EC2 instances*

1. Overview
2. packages
3. groups
4. users
5. sources
6. files
7. commands
8. services

### Ch06_L03 – cfn-hup
*Learn how to use cfn-up to keep you EC2 instances in sync with changes to your templates.*

1. How it works
2. Configuring
3. DEMO

### Ch06_L04 – Resource Policies
*Learn how to orgastrate the provisioning, updating and deleting of your instances with resource policies and cfn-signal.*

1. What are they?
2. [Creation Policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html)
2. [Update Policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html)
2. [Deletion Policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html)
3. cfn-signal

## Chapter 7 - Working with Serverless
*Learn advanced techniques and workflows when working with CloudFormation and serverless; along with solutions to common challenges.*

### Ch07_L01-L03 – AWS Serverless Application Repository
*A detailed look at AWS Serverless Application Repository; what it is and how to use it as your team's extensive infrastructure rolodex.*

1. What is AWS SAR?
2. Searching for Apps
3. Publishing Apps
4. Using Apps
https://docs.aws.amazon.com/serverlessrepo/latest/devguide/security_iam_resource-based-policy-examples.html

### Ch07_L03-L04 – JAMStack Deployment (Voting App)
*Learn how to automate the deployment of a serverless real-time voting application; as well as solutions to related CloudFormation challenges.*

1. What we’re going to build
2. Review Template & Code
3. Outputs injection
3. Deleting S3 assets as part of stack delete

## Chapter 8 - Putting it all together (Self Service Portal)
*Learn how you can programmatically explore and control CloudFormation in a custom built Cloud Portal complete with Github Repository and Actions Integrations.*

### Ch08_L01 – Programmatic CloudFormation
*A discussion of common uses for programmic control of CloudFormation. A detailed look at the Cloud Portal application you'll be deploying as well as a step-by-step deployment walk-through.*

1. Use Cases
2. Cloud Portal Intro
3. Deployment

### Ch08_L02 – Portal Code Walk-Through
*A review of the Cloud Portal functionality followed by a comprehesive code walk-through to see what makes it tick.*

1. Cloud Portal Exploration
2. Code Walk-Through

### Ch08_L03 - Complete Course Clean-up
*A full and complete walk-through and tear down of all stacks, keys, configs, ssm params, roles etc that we're created for this course.*

1. Clean up

## Chapter 9 - Other Tools
*Simplfiy your CloudFormation workflow with a  an industry CLI tool. We’ll briefly review and compare a number of industry tool options. Additionally, we'll also be taking a quick look at the CloudFormation Registry and CLI.*

### Ch9_L01 – Frameworks
*A high-level look at The Serverless Framework, AWS SAM, Troposphere and AWS CDK; compairing their feature sets and workflows.*

1. Troposphere
2. The Serverless Framework
3. AWS SAM
4. AWS CDK

### Ch9_L02 – CloudFormation Registry and CLI
*Learn how, even though new to the scene at time of recording; the CloudFormation Registry and CLI promise to significantly standardize and open up CloudFormation to third-party resources.*

1. The Registry
2. The CLI
3. Using 3rd Party Providers
4. Creating Your Own Provider

### Ch9_L03 – Conclusion
*Congradulations, a sincere thanks and brief good-bye; until next time.*

## Links

- [AWS CloudFormation User Guide](https://github.com/awsdocs/aws-cloudformation-user-guide)
- [aws-cf-templates](https://github.com/widdix/aws-cf-templates)
- [aws-cloudformation-templates](https://github.com/awslabs/aws-cloudformation-templates)
- [Limits](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)
- [IDE Tips](https://hodgkins.io/up-your-cloudformation-game-with-vscode)
- [New Parameter Types](https://aws.amazon.com/blogs/devops/using-the-new-cloudformation-parameter-types/)
- [Custom Resource Auto-approve cert](https://www.alexdebrie.com/posts/cloudformation-custom-resources/)
- [Macro Ideas](https://www.alexdebrie.com/posts/cloudformation-macros/)
- [Blue/Green Deploys](http://think-devops.com/blogs/blue-green-deployments.html)

## Missing Topics
- CFN Designer
- DependsOn
- Stack Notifications (https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-add-tags.html)
- WaitCondition



## Edits
- StackSets and OUs in console vs CLI
- Template Operations
  - Conditionals !And is not used in example
  - all code examples need to wipe in
  - !Split UsualSuspectsParam instead of UsualSuspects:
  
- Setup of main deploy bucket in overview of course
- setup yarn shortcut to install all node modules
- Remove statement about using cfn-lambda as module
- Add Blue-Green Deployment of CloudFormation Templates (Domains)
