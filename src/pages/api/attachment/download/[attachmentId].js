import ipAllowed from "@/utils/ipAllowed";
import downloadFromS3Bucket from "@/utils/downloadFromS3Bucket";
import getTandisAttachment from "@/utils/getTandisAttachment";
import updateTandisAttachment from "@/utils/updateTandisAttachment";

export const maxDuration = 60;

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
  const attachmentRequestID = attachment.attachmentRequestId;
  const key = `/${labId}/${orderId}/${attachmentId}/${filename}`;

  // Download file from S3 bucket
  let file = await downloadFromS3Bucket({ labId, orderId, attachmentId, filename });
  if (!file) {
    console.log("### file download failed: ", attachmentId);
    return response.status(404).send({ response: { status: 404, statusText: "File download failed" } });
  } else {
    console.log("### file downloaded ok");
  }

  // Update attachment and upload file
  const updateResult = await updateTandisAttachment({ attachmentRequestID, filename, file });

  return response.status(200).send(updateResult);
}