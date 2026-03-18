#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DecpInfraStack } from '../lib/decp-infra-stack';
import { DecpServicesStack } from '../lib/decp-services-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Step 1: Deploy this first, then push images to ECR
const infra = new DecpInfraStack(app, 'DecpInfraStack', {
  env,
  description: 'DECP — VPC, ECR, ECS cluster, ALB, infra EC2',
});

// Step 2: Deploy this after images are pushed
// cdk deploy DecpServicesStack -c corsOrigin=http://your-s3-bucket.s3-website.amazonaws.com
new DecpServicesStack(app, 'DecpServicesStack', {
  env,
  description: 'DECP — ECS Fargate services',
  infra,
  corsAllowedOrigin: app.node.tryGetContext('corsOrigin') ?? 'http://localhost:3000',
});
