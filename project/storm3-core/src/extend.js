const formatters = require('../../storm3-core-helpers/export').formatters;
const Method = require('../../storm3-core-method/export');
const utils = require('../../storm3-utils/export');


const extend = function (pckg) {
  const ex = function (extension) {

    let extendedObject;
    if (extension.property) {
      if (!pckg[extension.property]) {
        pckg[extension.property] = {};
      }
      extendedObject = pckg[extension.property];
    } else {
      extendedObject = pckg;
    }

    if (extension.methods) {
      extension.methods.forEach(function (method) {
        if (!(method instanceof Method)) {
          method = new Method(method);
        }

        method.attachToObject(extendedObject);
        method.setRequestManager(pckg._requestManager);
      });
    }

    return pckg;
  };

  ex.formatters = formatters;
  ex.utils = utils;
  ex.Method = Method;

  return ex;
};


module.exports = extend;

