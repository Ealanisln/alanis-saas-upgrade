const client = require("@sendgrid/client");

export default async function (req: any, res: any) {
  client.setApiKey(process.env.SENDGRID_API_KEY);

  const { name, email, message } = req.body;

  const data = {
    contacts: [
      {
        email: `${email}`,
        first_name: `${name}`,
        message: `${message}`,
      },
    ],
  };

  const request = {
    // change the url endpoint, here is an example url from sendgrid -
    // where the user input gets added to a marketing contact list
    url: `https://api.sendgrid.com/v3/marketing/contacts`,
    method: "PUT",
    body: data,
  };

  try {
    await client.request(request);
    res.status(200).send("Message was sent!");
  } catch (error) {
    res.status(400).send("Something went wrong - try again later!");
  }
}
