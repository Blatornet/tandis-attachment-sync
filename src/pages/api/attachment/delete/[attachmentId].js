import ipAllowed from "@/utils/ipAllowed";
import getTandisAttachment from "@/utils/getTandisAttachment";
import deleteFromS3Bucket from "@/utils/deleteFromS3Bucket";

export default async function POST(request, response) {
  // Check if IP is allowed
  if (!ipAllowed({ headers: request.headers, response })) {
    console.log("### ip blocked");
    return response.status(403).send({ response: { status: 403, statusText: "Forbidden" } });
  } else {
    console.log("### ip allowed");
  }

  // Check if attachmentId is provided
  const attachmentId = request.query.attachmentId;
  if (!attachmentId) {
    return response.status(400).send({ response: { status: 400, statusText: "Missing attachmentId" } });
  }

  // Fetch attachment info
  const attachment = await getTandisAttachment({ attachmentId, fetchAttachment: false });
  if (!attachment) {
    console.log("### attachment not found: ", attachmentId);
    return response.status(404).send({ response: { status: 404, statusText: "Attachment not found" } });
  } else {
    console.log("### attachment found: ", attachment);
  }

  // Build AWS S3 key
  const labId = attachment.attachmentLabId;
  const orderId = attachment.attachmentOrderId;
  const filename = attachment.attachmentName;

  // Delete file from S3 bucket
  let deleteResult = await deleteFromS3Bucket({ labId, orderId, attachmentId, filename });
  if (!deleteResult) {
    console.log("### file delete failed: ", attachmentId);
    return response.status(404).send({ response: { status: 404, statusText: "File delete failed" } });
  } else {
    console.log("### file delete ok");
  }

  return response.status(200).send(deleteResult);
}