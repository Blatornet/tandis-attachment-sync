import FormData from "form-data";
import fs from "fs";

import axios from "./axios.js";
import getArsAccessToken from "./getArsAccessToken.js";

const updateTandisAttachment = async ({ attachmentRequestID, filename, file }) => {
  try {
    console.log("### update attachment info: ", attachmentRequestID);
    if (!attachmentRequestID) {
      console.log("### update attachment Request ID missing: ", attachmentRequestID);
      return null;
    }

    const accessToken = await getArsAccessToken();

    const data = new FormData();
    data.append('entry', `{"values":{"Attachment_File":"${filename}"}}`, { contentType: 'application/json' });
    data.append('attach-Attachment_File', file, filename);

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `https://saas02.tandis.app:8443/api/arsys/v1/entry/BTS:SOT:Order:Attachments/${attachmentRequestID}`,
      headers: {
        'Authorization': `AR-JWT ${accessToken}`,
        ...data.getHeaders()
      },
      data: data
    };

    const updateAttachmentResponse = await axios.request(config);

    if (updateAttachmentResponse.status == 204) {
      console.log("### update attachment success");
      return {
        status: 200,
        statusText: "Download successful",
        data: {
          filename
        },
      };
    } else {
      console.log("### update attachment failed: ", updateAttachmentResponse);
      return {
        status: 400,
        statusText: "Download failed",
        error: updateAttachmentResponse
      };
    }
  } catch (error) {
    console.log("### update attachment failed: ", error);
    return {
      status: 500,
      statusText: "Download failed",
      error
    };
  }
}

export default updateTandisAttachment;