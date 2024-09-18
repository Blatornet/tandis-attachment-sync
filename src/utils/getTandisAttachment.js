import axios from "./axios.js";
import getArsAccessToken from "./getArsAccessToken.js";

const getTandisAttachment = async ({ attachmentId, fetchAttachment = true }) => {
  console.log("### get attachment info: ", attachmentId);
  const accessToken = await getArsAccessToken();

  const querystring = new URLSearchParams();
  querystring.append("q", `ID="${attachmentId}"`);

  const getAttachmentInfo = await axios.get(
    `/api/arsys/v1/entry/BTS:SOT:Order:Attachments?${querystring}`,
    {
      headers: {
        Authorization: `AR-JWT ${accessToken}`
      },
    }
  );

  const data = getAttachmentInfo?.data?.entries[0]?.values;

  if (!data) {
    console.log("### attachment info not found: ", attachmentId);
    return null;
  } else {
    console.log("### attachment info found: ", attachmentId);
  }

  const attachment = {
    attachmentId: data?.ID,
    attachmentName: data?.Filename,
    attachmentLabId: data?.IDLab,
    attachmentOrderId: data?.IDOrder,
    attachmentFile: data?.Attachment_File,
    attachmentRequestId: data?.["Request ID"],
    attachmentFileData: null
  }

  if (!fetchAttachment) {
    return attachment;
  }

  const href = data?.Attachment_File?.href?.replace("http", "https");
  console.log("### get attachment file: ", href);
  const getAttachmentData = await axios.get(
    href,
    {
      headers: {
        Authorization: `AR-JWT ${accessToken}`
      },
      responseType: 'arraybuffer'
    }
  );

  if (!getAttachmentData.data) {
    console.log("### attachment file not found: ", href);
    return null;
  } else {
    console.log("### attachment file found: ", href);
  }

  attachment.attachmentFileData = getAttachmentData.data;

  return attachment;
}

export default getTandisAttachment;