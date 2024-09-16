import ipAllowed from "@/utils/ipAllowed";
import downloadFromS3Bucket from "@/utils/downloadFromS3Bucket";

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

  // ETAG 846b8a85df32bbcbb8440ad32766d3b6

  // Build AWS S3 download key
  let labId = "IDGAAE4GGO75PAORMYL8OQQV4T3IH8";
  let orderId = "IDGACTM7CUXVLARLB2LURKBN2Q5OD4";
  let filename = "Tandis presentation SACD maj.pptx";

  const key = `/${labId}/${orderId}/${attachmentId}/${filename}`;

  // Downloadoad file from S3 bucket
  let result = await downloadFromS3Bucket({ labId, orderId, attachmentId, filename });

  console.log("### result: ", result);

  const downloadStatus = {
    status: 200,
    statusText: "Download successful",
    data: {

    },
  };
  return response.status(200).send(downloadStatus);
}