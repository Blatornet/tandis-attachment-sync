import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const { AWS_S3_REGION, AWS_S3_ACCESS_KEY, AWS_S3_ACCESS_KEY_SECRET, AWS_S3_BUCKET_NAME } = process.env;

const deleteFromS3Bucket = async ({ labId, orderId, attachmentId, filename }) => {
  if (!labId) {
    return { response: { status: 400, statusText: "No LabId provided" } };
  }
  if (!orderId) {
    return { response: { status: 400, statusText: "No OrderId provided" } };
  }
  if (!attachmentId) {
    return { response: { status: 400, statusText: "No AttachmentId provided" } };
  }
  if (!AWS_S3_ACCESS_KEY || !AWS_S3_ACCESS_KEY_SECRET || !AWS_S3_REGION || !AWS_S3_BUCKET_NAME) {
    return { response: { status: 400, statusText: "Missing AWS S3 Credentials" } };
  }

  try {
    const client = new S3Client({
      region: AWS_S3_REGION,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_ACCESS_KEY_SECRET
      }
    });

    const key = `${labId}/${orderId}/${attachmentId}/${filename}`;

    const result = await client.send(
      new DeleteObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key
      })
    );

    const statusCode = result.$metadata.httpStatusCode || 0;

    if (statusCode === 204) {
      console.log("### delete successful: ", result);
      return { response: { status: 200, statusText: "Delete successful" } };
    }
  } catch (error) {
    console.log(error);
    return { response: { status: 500, statusText: "Delete failed", error } };
  }
}

export default deleteFromS3Bucket;