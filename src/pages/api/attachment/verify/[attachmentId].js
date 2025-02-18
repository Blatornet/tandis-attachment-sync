import ipAllowed from "@/utils/ipAllowed";
import getTandisAttachment from "@/utils/getTandisAttachment";
import verifyAttachment from "@/utils/verifyAttachment";

export default async function GET(request, response) {
  // Check if IP is allowed
  if (!ipAllowed({ headers: request.headers, response })) {
    console.log("### ip blocked");
    return response
      .status(403)
      .send({ response: { status: 403, statusText: "Forbidden" } });
  } else {
    console.log("### ip allowed");
  }

  // Check if attachmentId is provided
  const attachmentId = request.query.attachmentId;
  if (!attachmentId) {
    return response
      .status(400)
      .send({ response: { status: 400, statusText: "Missing attachmentId" } });
  }

  // Fetch attachment data
  const attachment = await getTandisAttachment({
    attachmentId,
    fetchAttachment: false,
  });

  if (!attachment) {
    return response.status(400).send({
      response: {
        status: 400,
        statusText: "Attachment data not found for ID: [" + attachmentId + "]",
      },
    });
  }

  // Verify attachment on AWS S3
  const verifyStatus = await verifyAttachment({
    labId: attachment.attachmentLabId,
    attachmentId: attachment.attachmentId,
    filename: attachment.attachmentName,
  });

  return response.status(200).send(verifyStatus);
}
