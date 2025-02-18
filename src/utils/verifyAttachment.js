import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const {
  AWS_S3_REGION,
  AWS_S3_ACCESS_KEY,
  AWS_S3_ACCESS_KEY_SECRET,
  AWS_S3_BUCKET_NAME,
} = process.env;

const verifyAttachment = async ({ labId, attachmentId, filename }) => {
  if (!labId) {
    return { response: { status: 400, statusText: "No LabId provided" } };
  }
  if (!attachmentId) {
    return {
      response: { status: 400, statusText: "No AttachmentId provided" },
    };
  }
  if (!filename) {
    return { response: { status: 400, statusText: "No File Name provided" } };
  }
  if (
    !AWS_S3_ACCESS_KEY ||
    !AWS_S3_ACCESS_KEY_SECRET ||
    !AWS_S3_REGION ||
    !AWS_S3_BUCKET_NAME
  ) {
    return {
      response: { status: 400, statusText: "Missing AWS S3 Credentials" },
    };
  }

  try {
    const client = new S3Client({
      region: AWS_S3_REGION,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_ACCESS_KEY_SECRET,
      },
    });

    const key = `${labId}/${attachmentId}/${filename}`;

    const result = await client.send(
      new HeadObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
      })
    );

    console.log("### verification result ", result);

    const statusCode = result.$metadata.httpStatusCode || 0;

    if (statusCode === 200) {
      console.log("### verification successful! etag: ", result.ETag);
      return {
        response: {
          status: 200,
          statusText: "Verification successful",
          etag: result.ETag,
        },
      };
    }
  } catch (error) {
    const errorStatus = error.$metadata.httpStatusCode || 0;

    if (errorStatus === 404) {
      console.log("### verification failed! etag: ", error.$metadata.requestId);
      return {
        response: {
          status: 404,
          statusText: "Verification failed - file not found",
          requestId: error.$metadata.requestId,
        },
      };
    } else {
      console.log(error);
      return {
        response: { status: 500, statusText: "Verification failed", error },
      };
    }
  }
};

export default verifyAttachment;
