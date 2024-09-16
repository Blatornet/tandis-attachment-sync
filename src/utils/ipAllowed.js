const ipAllowed = ({ headers, response }) => {
  const ip = headers['x-real-ip'];
  const ipFilter = process.env.IP_ADDRESS_ALLOWED;

  if (!ip || !ipFilter) {
    console.log("### ip blocked: ", ip);
    return response.status(400).send({ response: { status: 400, statusText: "Missing attachmentId" } });
  } else {
    console.log("### ip allowed: ", ip);
  }

  return ipFilter.includes(ip);
}

export default ipAllowed;