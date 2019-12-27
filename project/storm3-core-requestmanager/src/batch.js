const Jsonrpc = require('./jsonrpc');
const errors = require('storm3-core-helpers').errors;

const Batch = function (requestManager) {
  this.requestManager = requestManager;
  this.requests = [];
};

/**
 * Should be called to add create new request to batch request
 *
 * @method add
 * @param {Object} request jsonrpc  object
 */
Batch.prototype.add = function (request) {
  this.requests.push(request);
};

/**
 * Should be called to execute batch request
 *
 * @method execute
 */
Batch.prototype.execute = function () {
  const requests = this.requests;
  this.requestManager.sendBatch(requests, function (err, results) {
    results = results || [];
    requests.map(function (request, index) {
      return results[index] || {};
    }).forEach(function (result, index) {
      if (requests[index].callback) {
        if (result && result.error) {
          return requests[index].callback(errors.ErrorResponse(result));
        }

        if (!Jsonrpc.isValidResponse(result)) {
          return requests[index].callback(errors.InvalidResponse(result));
        }

        try {
          requests[index].callback(null, requests[index].format ? requests[index].format(result.result) : result.result);
        } catch (err) {
          requests[index].callback(err);
        }
      }
    });
  });
};

module.exports = Batch;

