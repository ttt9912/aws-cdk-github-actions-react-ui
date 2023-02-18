#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/aws-cdk-github-actions-react-ui-stack';

const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', {
    env: { region: 'eu-central-1', account: '585098453895' }
});
