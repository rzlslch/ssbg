module.exports = (content, includeValue = false) => {
  try {
    let config = {};
    let config_prefix = content.indexOf('---\n');
    let config_suffix = content.lastIndexOf('\n---\n');
    if (config_prefix > -1 && config_suffix > -1) {
      let config_string = content.substring(config_prefix + 4, config_suffix)
      let config_array = config_string.split('\n');
      for (const arr of config_array) {
        let key = arr.substring(0, arr.indexOf(':')).trim();
        let value = arr.substring(arr.indexOf(':') + 1).trim().replace(/\"/g, '').replace(/\'/g, '');
        config[key] = value;
      }
    }
    if (includeValue) {
      let value = content.substring(config_suffix > 0 ? config_suffix + 4 : -1);
      config.value = value;
    }
    return config;
  } catch (error) {
    logger.error(error);
    return {};
  }
}