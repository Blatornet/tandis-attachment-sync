import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const { AWS_S3_REGION, AWS_S3_ACCESS_KEY, AWS_S3_ACCESS_KEY_SECRET, AWS_S3_BUCKET_NAME } = process.env;

const uploadToS3Bucket = async ({ labId, orderId, attachmentId, filename, filedata }) => {
  if (!labId) {
    return { response: { status: 400, statusText: "No LabId provided" } };
  }
  if (!orderId) {
    return { response: { status: 400, statusText: "No OrderId provided" } };
  }
  if (!attachmentId) {
    return { response: { status: 400, statusText: "No AttachmentId provided" } };
  }
  if (!filename) {
    return { response: { status: 400, statusText: "No File Name provided" } };
  }
  if (!filedata) {
    return { response: { status: 400, statusText: "No File Data provided" } };
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
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: filedata,
      })
    );

    console.log("### upload result ", result);

    const statusCode = result.$metadata.httpStatusCode || 0;

    if (statusCode === 200) {
      console.log("### upload successful! etag: ", result.ETag);
      return { response: { status: 200, statusText: "Upload successful", etag: result.ETag } };
    }
  } catch (error) {
    console.log(error);
    return { response: { status: 500, statusText: "Upload failed", error } };
  }
}

export default uploadToS3Bucket;