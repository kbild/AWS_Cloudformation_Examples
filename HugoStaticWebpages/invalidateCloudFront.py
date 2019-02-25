import time
import logging
from botocore.exceptions import ClientError
import boto3

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

def codepipeline_success(job_id):
    """
    Puts CodePipeline Success Result
    """
    try:
        codepipeline = boto3.client('codepipeline')
        codepipeline.put_job_success_result(jobId=job_id)
        LOGGER.info('===SUCCESS===')
        return True
    except ClientError as err:
        LOGGER.error("Failed to PutJobSuccessResult for CodePipeline!\n%s", err)
        return False

def codepipeline_failure(job_id, message):
    try:
        codepipeline = boto3.client('codepipeline')
        codepipeline.put_job_failure_result(
            jobId=job_id,
            failureDetails={'type': 'JobFailed', 'message': message}
        )
        LOGGER.info('===FAILURE===')
        return True
    except ClientError as err:
        LOGGER.error("Failed to PutJobFailureResult for CodePipeline!\n%s", err)
        return False


def lambda_handler(event, context):
    LOGGER.info(event)
    try:
        job_id = event['CodePipeline.job']['id']
        distId = event['CodePipeline.job']['data']['actionConfiguration']['configuration']['UserParameters']
        client = boto3.client('cloudfront')
        invalidation = client.create_invalidation(DistributionId=distId,
            InvalidationBatch={
                'Paths': {
                    'Quantity': 1,
                    'Items': ['/*']
            },
            'CallerReference': str(time.time())
        })
        codepipeline_success(job_id)
        
    except KeyError as err:
        LOGGER.error("Could not retrieve CodePipeline Job ID!\n%s", err)
        return False
        codepipeline_failure(job_id, err)
