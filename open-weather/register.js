const axios = require('axios');
const { log } = require('./logger');

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
    log('register', { registryID: response.data.registryID });
  } catch (err) {
    log('register-failed', { error: err.message }, 'error');
  }
}

module.exports = { registerWithDiscovery };
