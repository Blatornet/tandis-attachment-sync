import ipAllowed from "@/utils/ipAllowed";
import getTandisAttachment from "@/utils/getTandisAttachment";
import uploadToS3Bucket from "@/utils/uploadToS3Bucket";

export default async function GET(request, response) {
  // Check if IP is allowed
  if (!ipAllowed({ headers: request.headers, response })) {
    console.log("### ip blocked: ", ip);
    return response.status(403).send({ response: { status: 403, statusText: "Forbidden" } });
  }

  // Check if attachmentId is provided
  const attachmentId = request.query.attachmentId;
  if (!attachmentId) {
    return response.status(400).send({ response: { status: 400, statusText: "Missing attachmentId" } });
  }

  // Fetch attachment data
  const attachment = await getTandisAttachment({ attachmentId });

  if (!attachment) {
    return response.status(400).send({ response: { status: 400, statusText: "Attachment data not found for ID: [" + attachmentId + "]" } });
  }

  // Upload attachment to AWS S3
  const uploadStatus = await uploadToS3Bucket({
    labId: attachment.attachmentLabId,
    orderId: attachment.attachmentOrderId,
    attachmentId: attachment.attachmentId,
    filename: attachment.attachmentName,
    filedata: attachment.attachmentFileData,
  });

  return response.status(200).send(uploadStatus);
}