const ipAllowed = ({ headers, response }) => {
  const ip = headers["x-real-ip"];
  const ipFilter = process.env.IP_ADDRESS_ALLOWED;

  if (!ipFilter) {
    console.log("### ip-filter missing, please configure env");
    return response.status(400).send({
      response: { status: 400, statusText: "Missing ip-filter" },
    });
  }

  if (!ipFilter.includes("127.0.0.1")) {
    if (!ip) {
      console.log("### ip missing: ", ip);
      return response.status(400).send({
        response: { status: 400, statusText: "Missing ip" },
      });
    } else {
      console.log("### ip filter run for: ", ip);
    }
  }

  return ipFilter.includes(ip);
};

export default ipAllowed;
