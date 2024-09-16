const ipAllowed = ({ headers, response }) => {
  const ip = headers['x-real-ip'];
  const ipFilter = process.env.IP_ADDRESS_ALLOWED;

  if (!ip || !ipFilter) {
    console.log("### ip or filter missing: ", ip);
    return response.status(400).send({ response: { status: 400, statusText: "Missing ip or ip-filter" } });
  } else {
    console.log("### ip filter run for: ", ip);
  }

  return ipFilter.includes(ip);
}

export default ipAllowed;