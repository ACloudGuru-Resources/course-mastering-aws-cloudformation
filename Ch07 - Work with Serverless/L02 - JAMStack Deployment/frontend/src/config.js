const config = {
  git: {
    hash: process.env.REACT_APP_GIT_VERSION,
  },
  site: {
    api: process.env.REACT_APP_SERVICE_ENDPOINT_WEBSOCKET,
    url: process.env.REACT_APP_SITE_URL,
  },
};

console.log(config);

export default config;
