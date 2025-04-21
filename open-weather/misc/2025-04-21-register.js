const axios = require('axios');

async function registerWithDiscovery(PORT, design) {
  try {
    const registryURL = 'http://localhost:4000/register';

    const serviceInfo = {
      serviceName: design.serviceInfo.serviceName || 'openweather',
      serviceURL: `http://localhost:${PORT}`,
      tags: design.serviceInfo.tags || [],
      semanticProfile: design.serviceInfo.semanticProfile || 'urn:example:weather',
      mediaTypes: design.serviceInfo.mediaTypes || ['application/json'],
      pingURL: `http://localhost:${PORT}/ping`
    };

    const response = await axios.post(registryURL, serviceInfo);
    console.log('[register] Registered service:', response.data);
  } catch (err) {
    console.error('[register] Registration failed:', err.message);
  }
}

module.exports = { registerWithDiscovery };
