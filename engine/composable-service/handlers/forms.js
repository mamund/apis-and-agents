// composable-service/handlers/forms.js

module.exports = function formsHandler(req, res, designDoc) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const forms = [
    {
      rel: 'ping',
      method: 'GET',
      href: `${baseUrl}/ping`,
      input: [],
      output: '{ status: "ok" }'
    },
    {
      rel: 'execute',
      method: 'POST',
      href: `${baseUrl}/execute`,
      input: ['{ command, resource, id?, payload?, metadata? }'],
      output: '{ result }'
    },
    {
      rel: 'repeat',
      method: 'POST',
      href: `${baseUrl}/repeat`,
      input: ['{ command, resource, id?, payload?, metadata? }'],
      output: '{ result }'
    },
    {
      rel: 'revert',
      method: 'POST',
      href: `${baseUrl}/revert`,
      input: [],
      output: '{ status: "noop" }'
    }
  ];

  res.json(forms);
};
