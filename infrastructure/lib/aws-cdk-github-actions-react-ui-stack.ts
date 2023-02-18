import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const oai = new cloudfront.OriginAccessIdentity(this, 'OAI', {})

        const websiteBucket = new s3.Bucket(this, 'StaticWebsiteBucket', {
            bucketName: `demo-static-react-blabla-1999-bucket`,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });

        websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [websiteBucket.arnForObjects('*')],
            principals: [new iam.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));

        const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new origins.S3Origin(websiteBucket, { originAccessIdentity: oai }),
                compress: true,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED
            }
        })

        new CfnOutput(this, 'DistributionId', {
            value: distribution.distributionId
        })
    }
}
