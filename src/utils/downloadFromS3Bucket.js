import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const { AWS_S3_REGION, AWS_S3_ACCESS_KEY, AWS_S3_ACCESS_KEY_SECRET, AWS_S3_BUCKET_NAME } = process.env;

const downloadFromS3Bucket = async ({ labId, orderId, attachmentId, filename }) => {
  console.log("### downloadFromS3Bucket: ", { labId, orderId, attachmentId, filename });
  try {
    const client = new S3Client({
      region: AWS_S3_REGION,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_ACCESS_KEY_SECRET
      }
    });

    const response = await client.send(new GetObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${labId}/${orderId}/${attachmentId}/${filename}`
    }));

    //console.log("### response: ", response);

    //const file = await response.Body.transformToString();
    //console.log("### file: ", file.length);

    /*
    transformToByteArray: ÄAsyncFunction: transformToByteArrayÅ,
    transformToString: ÄAsyncFunction: transformToStringÅ,
    transformToWebStream: 
    */


    return response;
  } catch (error) {

  }
}

export default downloadFromS3Bucket;