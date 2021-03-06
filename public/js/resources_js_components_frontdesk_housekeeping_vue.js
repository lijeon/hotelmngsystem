(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_components_frontdesk_Housekeeping_vue"],{

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'NormalPopup',
  props: {
    width: {
      required: false,
      type: String
    },
    height: {
      required: false,
      type: String
    },
    showHeader: {
      required: false,
      type: Boolean,
      "default": true
    },
    dimmed: {
      required: false,
      type: Boolean,
      "default": false
    },
    bodyPadding: {
      type: String,
      "default": '20px'
    },
    noBorder: {
      required: false,
      type: Boolean,
      "default": false
    },
    transparent: {
      required: false,
      type: Boolean,
      "default": false
    },
    noFade: {
      required: false,
      type: Boolean,
      "default": false
    },
    properClass: {
      required: false,
      type: String,
      "default": ''
    },
    useAsConfirm: {
      required: false,
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      another_popup_is_opened: false,
      isVisible: false
    };
  },
  computed: {
    height100: function height100() {
      return this.another_popup_is_opened || this.dimmed;
    },
    style: function style() {
      return {
        backgroundColor: this.transparent ? 'transparent' : 'rgba(0, 0, 0, 0.3);'
      };
    }
  },
  mounted: function mounted() {
    var big_popups_opened = document.getElementsByClassName('big-popup').length > 0;

    if (big_popups_opened) {
      this.another_popup_is_opened = false;
      return;
    }

    this.another_popup_is_opened = this.dimmed ? false : document.getElementsByClassName('small-popup').length > 1;
  },
  methods: {
    open: function open() {
      this.isVisible = true;
    },
    close: function close() {
      this.isVisible = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NormalPopup_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../NormalPopup.vue */ "./resources/js/components/NormalPopup.vue");
/* harmony import */ var _services_employee_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/employee.services */ "./resources/js/services/employee.services.js");
/* harmony import */ var _services_department_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/department.services */ "./resources/js/services/department.services.js");
/* harmony import */ var _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/housekeeping.services */ "./resources/js/services/housekeeping.services.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'HousekeepersModal',
  components: {
    NormalPopup: _NormalPopup_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: ['room', 'housekeeper'],
  data: function data() {
    return {
      loading: false,
      employees: [],
      departments: [],
      selectedHousekeeper: null
    };
  },
  computed: {
    housekeepers: function housekeepers() {
      var _this = this;

      var housekeepers = [];
      var allEmployees = this.employees.filter(function (employee) {
        return _this.departments.some(function (dep) {
          return dep.id === employee.department_id;
        });
      });
      allEmployees.forEach(function (emp) {
        var depName = _this.getName(emp.department_id);

        if (depName && depName === 'Housekeeping') {
          var found = housekeepers.find(function (element) {
            return element.id === emp.id;
          });

          if (!found) {
            housekeepers.push(emp);
          }
        }
      });
      return housekeepers;
    }
  },
  methods: {
    test: function test() {
      console.log('sele', this.selectedHousekeeper);
    },
    getEmployees: function getEmployees() {
      var _this2 = this;

      this.loading = true;
      _services_employee_services__WEBPACK_IMPORTED_MODULE_1__["default"].getEmployees().then(function (res) {
        _this2.employees = res.data;
      })["catch"](function (error) {
        var _error$data, _error$response, _error$response2, _error$response2$data, _error$response3;

        _this2.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data = error.data) === null || _error$data === void 0 ? void 0 : _error$data.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.message) || (error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : (_error$response2$data = _error$response2.data) === null || _error$response2$data === void 0 ? void 0 : _error$response2$data.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this2.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this2.loading = false;
      });
    },
    getDepartments: function getDepartments() {
      var _this3 = this;

      this.loading = true;
      _services_department_services__WEBPACK_IMPORTED_MODULE_2__["default"].getDepartments().then(function (res) {
        _this3.departments = res.data;
      })["catch"](function (error) {
        var _error$data2, _error$response4, _error$response5, _error$response5$data, _error$response6;

        _this3.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data2 = error.data) === null || _error$data2 === void 0 ? void 0 : _error$data2.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.message) || (error === null || error === void 0 ? void 0 : (_error$response5 = error.response) === null || _error$response5 === void 0 ? void 0 : (_error$response5$data = _error$response5.data) === null || _error$response5$data === void 0 ? void 0 : _error$response5$data.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this3.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response6 = error.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this3.loading = false;
      });
    },
    getName: function getName(departmentId) {
      var _this$departments;

      var found = (_this$departments = this.departments) === null || _this$departments === void 0 ? void 0 : _this$departments.find(function (element) {
        return element.id === departmentId;
      });

      if (found) {
        return found.name;
      }
    },
    assignHousekeeper: function assignHousekeeper() {
      var _this4 = this;

      this.loading = true;
      var payload = {
        room_id: this.room.id,
        employee_id: this.selectedHousekeeper
      };
      _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_3__["default"].postHousekeepingSchedule(payload).then(function (res) {
        _this4.$notify.success({
          title: 'Success',
          type: 'Success',
          message: 'Housekeeper was assigned successfully'
        }); // this.$emit('close')


        _this4.$emit('housekeeperAssigned');
      })["catch"](function (error) {
        var _error$data3, _error$response7, _error$response8, _error$response8$data, _error$response9;

        _this4.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data3 = error.data) === null || _error$data3 === void 0 ? void 0 : _error$data3.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response7 = error.response) === null || _error$response7 === void 0 ? void 0 : _error$response7.message) || (error === null || error === void 0 ? void 0 : (_error$response8 = error.response) === null || _error$response8 === void 0 ? void 0 : (_error$response8$data = _error$response8.data) === null || _error$response8$data === void 0 ? void 0 : _error$response8$data.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this4.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response9 = error.response) === null || _error$response9 === void 0 ? void 0 : _error$response9.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this4.loading = false;
      });
    }
  },
  beforeMount: function beforeMount() {
    this.getDepartments();
    this.getEmployees();

    if (this.housekeeper) {
      this.selectedHousekeeper = this.housekeeper.id;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_room_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/room.services */ "./resources/js/services/room.services.js");
/* harmony import */ var _RoomModal_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RoomModal.vue */ "./resources/js/components/frontdesk/RoomModal.vue");
/* harmony import */ var _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/housekeeping.services */ "./resources/js/services/housekeeping.services.js");
/* harmony import */ var _services_department_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/department.services */ "./resources/js/services/department.services.js");
/* harmony import */ var _services_employee_services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/employee.services */ "./resources/js/services/employee.services.js");
/* harmony import */ var _services_guest_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/guest.services */ "./resources/js/services/guest.services.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    RoomModal: _RoomModal_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      loading: false,
      query: "",
      rooms: [],
      showRoomModal: false,
      roomProp: null,
      filterModel: {
        dirty: 'Dirty',
        clean: 'Clean',
        ready: 'Ready'
      },
      schedules: [],
      employees: [],
      departments: [],
      selectedHousekeeper: null,
      canSelect: false,
      selectedRooms: [],
      selectedFilter: 'All',
      guests: []
    };
  },
  computed: {
    filteredRooms: function filteredRooms() {
      var _this = this;

      var result = this.rooms;

      if (this.rooms && this.rooms.length > 0) {
        result = this.rooms.filter(function (room) {
          return room.cleaning_status === _this.selectedFilter;
        });

        if (this.selectedFilter === 'All') {
          result = this.rooms;
        }

        if (this.query && this.query.length > 0) {
          result = result.filter(function (r) {
            var _r$type, _r$code;

            return ((_r$type = r.type) === null || _r$type === void 0 ? void 0 : _r$type.toLowerCase().includes(_this.query.toLowerCase())) || ((_r$code = r.code) === null || _r$code === void 0 ? void 0 : _r$code.toLowerCase().includes(_this.query.toLowerCase()));
          });
        }
      }

      return result;
    },
    housekeepers: function housekeepers() {
      var _this2 = this;

      var housekeepers = [];
      var allEmployees = this.employees.filter(function (employee) {
        return _this2.departments.some(function (dep) {
          return dep.id === employee.department_id;
        });
      });
      allEmployees.forEach(function (emp) {
        var depName = _this2.getName(emp.department_id);

        if (depName && depName === 'Housekeeping') {
          var found = housekeepers.find(function (element) {
            return element.id === emp.id;
          });

          if (!found) {
            housekeepers.push(emp);
          }
        }
      });
      return housekeepers;
    },
    dirtyRooms: function dirtyRooms() {
      var dirtyRooms = [];
      this.rooms.forEach(function (room) {
        if (room.cleaning_status === 'Dirty') {
          dirtyRooms.push(room);
        }
      });
      return dirtyRooms;
    },
    cleanRooms: function cleanRooms() {
      var rooms = [];
      this.rooms.forEach(function (room) {
        if (room.cleaning_status === 'Clean') {
          rooms.push(room);
        }
      });
      return rooms;
    },
    readyRooms: function readyRooms() {
      var rooms = [];
      this.rooms.forEach(function (room) {
        if (room.cleaning_status === 'Ready') {
          rooms.push(room);
        }
      });
      return rooms;
    }
  },
  methods: {
    openRoomModalOrSelect: function openRoomModalOrSelect(room) {
      if (this.canSelect && (room.cleaning_status === 'Clean' || room.cleaning_status === 'Ready')) {
        if (!room.checked) {
          this.selectedRooms.push(room.id);
          room.checked = true;
        } else {
          room.checked = false;
          var x = this.selectedRooms.find(function (r) {
            return r === room.id;
          });
          var index = this.selectedRooms.indexOf(x);
          this.selectedRooms.splice(index, 1);
        }
      } else if (this.canSelect && room.cleaning_status === 'Dirty') {
        this.$notify.error({
          title: 'Info',
          type: 'Error',
          message: 'This room already has a housekeeper assigned'
        });
      } else {
        room.checked = false;

        if (this.selectedRooms.length > 0) {
          this.selectedRooms = [];
        }

        this.roomProp = room;
        this.showRoomModal = true;
      }
    },
    closeRoomModal: function closeRoomModal() {
      var _this3 = this;

      this.showRoomModal = false;
      this.$nextTick(function () {
        _this3.refreshData();
      });
    },
    isSelected: function isSelected(room) {
      var found = this.selectedRooms.find(function (r) {
        return r === room.id;
      });

      if (found) {
        return true;
      }

      return false;
    },
    assignHousekeeperToRooms: function assignHousekeeperToRooms() {
      this.canSelect = !this.canSelect;
    },
    getOptionsData: function getOptionsData() {
      var _this4 = this;

      this.loading = true;
      Promise.all([_services_employee_services__WEBPACK_IMPORTED_MODULE_4__["default"].getEmployees(), _services_department_services__WEBPACK_IMPORTED_MODULE_3__["default"].getDepartments(), _services_room_services__WEBPACK_IMPORTED_MODULE_0__["default"].getRooms(), _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_2__["default"].getHousekeepingSchedules(), _services_guest_services__WEBPACK_IMPORTED_MODULE_5__["default"].getGuests()].map(function (p, index) {
        return p.then(function (v) {
          return {
            data: v.data,
            status: "success",
            type: index == 0 ? "employees" : index == 1 ? "departments" : index == 2 ? "rooms" : index == 3 ? "schedules" : index === 4 ? 'guests' : "unknown"
          };
        }, function (e) {
          return {
            e: e,
            status: "error"
          };
        });
      })).then(function (results) {
        if (results.length) {
          results.filter(function (r) {
            return r.status == "success";
          }).forEach(function (res) {
            if (res.type == "employees") {
              _this4.employees = res.data;
              console.log('empl', _this4.employees);
            } else if (res.type == "departments") {
              _this4.departments = res.data;
              console.log('depts', _this4.departments);
            } else if (res.type == "rooms") {
              _this4.rooms = res.data;

              _this4.rooms.forEach(function (room) {
                _this4.$set(room, 'checked', false);
              });

              console.log('rooms', _this4.rooms);
            } else if (res.type == "schedules") {
              _this4.schedules = res.data;
              console.log('scj', _this4.schedules);
            } else if (res.type == "guests") {
              _this4.guests = res.data;
            }
          });
        }
      })["catch"](function (error) {
        _this4.loading = false;
        throw error;
      })["finally"](function () {
        _this4.loading = false;
      });
    },
    getName: function getName(departmentId) {
      var _this$departments;

      var found = (_this$departments = this.departments) === null || _this$departments === void 0 ? void 0 : _this$departments.find(function (element) {
        return element.id === departmentId;
      });

      if (found) {
        return found.name;
      }
    },
    getScheduledHousekeepers: function getScheduledHousekeepers(room) {
      var scheduledRoom = this.schedules.find(function (sch) {
        return sch.room_id === room.id;
      });

      if (scheduledRoom) {
        return this.getHousekeeper(scheduledRoom);
      } //    let scheduledHousekeepers = this.housekeepers.filter(sch => this.schedules.some(hk => hk.employee_id === sch.id && this.rooms.some(room => room.id === hk.room_id)))
      //    console.log('scheduledHousekeepers',scheduledHousekeepers)

    },
    getHousekeeper: function getHousekeeper(schedule) {
      var housekeeper = this.housekeepers.find(function (hk) {
        return hk.id === schedule.employee_id;
      });
      return housekeeper.name + ' ' + housekeeper.surname;
    },
    saveSchedules: function saveSchedules() {
      var _this5 = this;

      this.selectedRooms.forEach(function (room) {
        var payload = {
          room_id: room,
          employee_id: _this5.selectedHousekeeper
        };
        _this5.loading = true;
        _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_2__["default"].postHousekeepingSchedule(payload).then(function (res) {
          console.log('payload', payload);

          _this5.refreshData();
        })["catch"](function (error) {
          var _error$data, _error$response, _error$response2, _error$response2$data, _error$response3;

          _this5.loading = false;
          var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data = error.data) === null || _error$data === void 0 ? void 0 : _error$data.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.message) || (error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : (_error$response2$data = _error$response2.data) === null || _error$response2$data === void 0 ? void 0 : _error$response2$data.message);

          if (!errorMessage && error !== null && error !== void 0 && error.data) {
            errorMessage = error.data;
          }

          if (!errorMessage) errorMessage = 'Error_occurred';

          _this5.$notify.error({
            title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.status),
            message: errorMessage
          });
        })["finally"](function () {
          _this5.loading = false;
        });
      });
    },
    refreshData: function refreshData() {
      console.log('here');
      this.getOptionsData();
    } // selectHousekeeper

  },
  beforeMount: function beforeMount() {
    // this.getRooms()
    // this.getHousekeepingSchedules()
    this.getOptionsData();

    if (this.$route.params.selectedFilter) {
      console.log('this.$route.params.selectedFilter', this.$route.params.selectedFilter);
      this.selectedFilter = this.$route.params.selectedFilter;
    }
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {
    if (to.name === 'housekeeping') this.getOptionsData;
    next();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NormalPopup_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../NormalPopup.vue */ "./resources/js/components/NormalPopup.vue");
/* harmony import */ var _services_employee_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/employee.services */ "./resources/js/services/employee.services.js");
/* harmony import */ var _services_department_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/department.services */ "./resources/js/services/department.services.js");
/* harmony import */ var _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/housekeeping.services */ "./resources/js/services/housekeeping.services.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'HousekeepingHistoryModal',
  props: ['room', 'housekeepers', 'housekeepingHistorySchedules'],
  components: {
    NormalPopup: _NormalPopup_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      loading: false,
      housekeepingHistoryList: [],
      fields: ['housekeeperName', 'housekeeperSurname', 'created_at'],
      labels: {
        name: 'housekeeperName',
        surname: 'housekeeperSurname',
        date: 'created_at'
      }
    };
  },
  methods: {
    getName: function getName(sch) {
      return this.housekeepers.find(function (hk) {
        return hk.id === sch.employee_id;
      }).name; // if(housekeeper){
      //     return housekeeper.name + ' ' + housekeeper.surname
      // }
    },
    getHousekeeperLastname: function getHousekeeperLastname(sch) {
      return this.housekeepers.find(function (hk) {
        return hk.id === sch.employee_id;
      }).surname; // if(housekeeper){
      //     return housekeeper.name + ' ' + housekeeper.surname
      // }
    }
  },
  beforeMount: function beforeMount() {
    var _this = this;

    var housekeepingHistory = [];
    housekeepingHistory = this.housekeepingHistorySchedules.filter(function (sch) {
      return sch.room_id === _this.room.id;
    });

    if (housekeepingHistory && housekeepingHistory.length > 0) {
      housekeepingHistory.forEach(function (sch) {
        sch.housekeeperName = _this.getName(sch);
        sch.housekeeperSurname = _this.getHousekeeperLastname(sch);
      });
    }

    this.housekeepingHistoryList = housekeepingHistory;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NormalPopup_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../NormalPopup.vue */ "./resources/js/components/NormalPopup.vue");
/* harmony import */ var _HousekeepersModal_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HousekeepersModal.vue */ "./resources/js/components/frontdesk/HousekeepersModal.vue");
/* harmony import */ var _services_room_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/room.services */ "./resources/js/services/room.services.js");
/* harmony import */ var _services_housekeeping_history_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/housekeeping-history.service */ "./resources/js/services/housekeeping-history.service.js");
/* harmony import */ var _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/housekeeping.services */ "./resources/js/services/housekeeping.services.js");
/* harmony import */ var _HousekeepingHistoryModal_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./HousekeepingHistoryModal.vue */ "./resources/js/components/frontdesk/HousekeepingHistoryModal.vue");
/* harmony import */ var _services_reservation_services__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/reservation.services */ "./resources/js/services/reservation.services.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'RoomModal',
  components: {
    NormalPopup: _NormalPopup_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    HousekeepersModal: _HousekeepersModal_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    HousekeepingHistoryModal: _HousekeepingHistoryModal_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  props: ['roomProp', 'housekeepers', 'departments', 'schedules', 'guestsProp'],
  data: function data() {
    return {
      loading: false,
      activeIndex: 1,
      showHousekeepersModal: false,
      scheduledHousekeeper: null,
      hk: false,
      reRenderKey: 1,
      showHousekeepingHistoryModal: false,
      housekeepingHistory: [],
      reservations: []
    };
  },
  computed: {
    reservationDetails: function reservationDetails() {
      var _this = this;

      var res;
      this.reservations.forEach(function (reservation) {
        reservation.rooms.forEach(function (room) {
          if (_this.roomProp.id === room.id) {
            res = reservation;
            console.log('here');
          }
        });
      });
      return res;
    },
    guest: function guest() {
      var _this2 = this;

      return this.guestsProp.find(function (guest) {
        return guest.id === _this2.reservationDetails.guest_id;
      });
    }
  },
  methods: {
    assignHousekeeper: function assignHousekeeper(event) {
      if (event) {}

      this.showHousekeepersModal = true;
    },
    getSchedule: function getSchedule(room) {
      return this.schedules.find(function (sch) {
        return sch.room_id === room.id;
      });
    },
    getScheduledHousekeepers: function getScheduledHousekeepers(room) {
      var scheduledRoom = this.schedules.find(function (sch) {
        return sch.room_id === room.id;
      });

      if (scheduledRoom) {
        this.housekeeperAssigned = true;
        return this.getHousekeeper(scheduledRoom);
      }
    },
    getHousekeeper: function getHousekeeper(schedule) {
      var housekeeper = this.housekeepers.find(function (hk) {
        return hk.id === schedule.employee_id;
      });
      this.scheduledHousekeeper = housekeeper;
      return housekeeper.name + ' ' + housekeeper.surname;
    },
    changeStatus: function changeStatus(room, mark) {
      var _this3 = this;

      if (mark.mark === 'Dirty') {
        room.cleaning_status = "Dirty";
      } else if (mark.mark === 'Clean') {
        room.cleaning_status = "Clean";
        var schedule = this.getSchedule(this.roomProp);
        this.removeHousekeeper(schedule);
      } else if (mark.mark === 'Ready') {
        room.cleaning_status = "Ready";
      }

      this.loading = true;

      if (room.status === true) {
        room.status = 1;
      } else if (room.status === false) {
        room.status = 0;
      }

      _services_room_services__WEBPACK_IMPORTED_MODULE_2__["default"].putRoom(room, room.id).then(function (res) {
        _this3.$emit('close');
      })["catch"](function (error) {
        var _error$data, _error$response, _error$response2, _error$response2$data, _error$response3;

        _this3.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data = error.data) === null || _error$data === void 0 ? void 0 : _error$data.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.message) || (error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : (_error$response2$data = _error$response2.data) === null || _error$response2$data === void 0 ? void 0 : _error$response2$data.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this3.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this3.loading = false;
      });
    },
    housekeeperAssigned: function housekeeperAssigned() {
      this.showHousekeepersModal = false;
      this.getScheduledHousekeepers(this.roomProp);
    },
    removeHousekeeper: function removeHousekeeper(schedule) {
      var _this4 = this;

      this.loading = true;
      _services_housekeeping_history_service__WEBPACK_IMPORTED_MODULE_3__["default"].postHousekeepingHistorySchedule(schedule).then(function (res) {
        _this4.deleteHousekeepingSchedule(schedule);
      })["catch"](function (error) {
        var _error$data2, _error$response4, _error$response5, _error$response5$data, _error$response6;

        _this4.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data2 = error.data) === null || _error$data2 === void 0 ? void 0 : _error$data2.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.message) || (error === null || error === void 0 ? void 0 : (_error$response5 = error.response) === null || _error$response5 === void 0 ? void 0 : (_error$response5$data = _error$response5.data) === null || _error$response5$data === void 0 ? void 0 : _error$response5$data.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this4.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response6 = error.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this4.loading = false;
      });
    },
    deleteHousekeepingSchedule: function deleteHousekeepingSchedule(schedule) {
      var _this5 = this;

      _services_housekeeping_services__WEBPACK_IMPORTED_MODULE_4__["default"].deleteHousekeepingSchedule(schedule.id).then(function (res) {
        _this5.$notify.success({
          title: 'Success',
          type: 'Success',
          message: 'Room returned to clean'
        }); // this.$emit('refreshData')

      })["catch"](function (error) {
        var _error$data3, _error$response7, _error$response8, _error$response8$data, _error$response9;

        _this5.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data3 = error.data) === null || _error$data3 === void 0 ? void 0 : _error$data3.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response7 = error.response) === null || _error$response7 === void 0 ? void 0 : _error$response7.message) || (error === null || error === void 0 ? void 0 : (_error$response8 = error.response) === null || _error$response8 === void 0 ? void 0 : (_error$response8$data = _error$response8.data) === null || _error$response8$data === void 0 ? void 0 : _error$response8$data.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this5.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response9 = error.response) === null || _error$response9 === void 0 ? void 0 : _error$response9.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this5.loading = false;
      });
    },
    closeHousekeepersModal: function closeHousekeepersModal() {
      this.showHousekeepersModal = false;
      this.reRenderKey++;
    },
    showHistoryModal: function showHistoryModal() {
      this.showHousekeepingHistoryModal = true;
    },
    getHousekeepingHistory: function getHousekeepingHistory() {
      var _this6 = this;

      this.loading = true;
      _services_housekeeping_history_service__WEBPACK_IMPORTED_MODULE_3__["default"].getHousekeepingHistorySchedules().then(function (res) {
        _this6.housekeepingHistory = res.data;
      })["catch"](function (error) {
        var _error$data4, _error$response10, _error$response11, _error$response11$dat, _error$response12;

        _this6.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data4 = error.data) === null || _error$data4 === void 0 ? void 0 : _error$data4.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response10 = error.response) === null || _error$response10 === void 0 ? void 0 : _error$response10.message) || (error === null || error === void 0 ? void 0 : (_error$response11 = error.response) === null || _error$response11 === void 0 ? void 0 : (_error$response11$dat = _error$response11.data) === null || _error$response11$dat === void 0 ? void 0 : _error$response11$dat.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this6.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response12 = error.response) === null || _error$response12 === void 0 ? void 0 : _error$response12.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this6.loading = false;
      });
    },
    getReservations: function getReservations() {
      var _this7 = this;

      this.loading = true;
      _services_reservation_services__WEBPACK_IMPORTED_MODULE_6__["default"].getReservations().then(function (res) {
        _this7.reservations = res.data;
        console.log('this.reservations', _this7.reservations);
      })["catch"](function (error) {
        var _error$data5, _error$response13, _error$response14, _error$response14$dat, _error$response15;

        _this7.loading = false;
        var errorMessage = (error === null || error === void 0 ? void 0 : (_error$data5 = error.data) === null || _error$data5 === void 0 ? void 0 : _error$data5.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : (_error$response13 = error.response) === null || _error$response13 === void 0 ? void 0 : _error$response13.message) || (error === null || error === void 0 ? void 0 : (_error$response14 = error.response) === null || _error$response14 === void 0 ? void 0 : (_error$response14$dat = _error$response14.data) === null || _error$response14$dat === void 0 ? void 0 : _error$response14$dat.message);

        if (!errorMessage && error !== null && error !== void 0 && error.data) {
          errorMessage = error.data;
        }

        if (!errorMessage) errorMessage = 'Error_occurred';

        _this7.$notify.error({
          title: (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : (_error$response15 = error.response) === null || _error$response15 === void 0 ? void 0 : _error$response15.status),
          message: errorMessage
        });
      })["finally"](function () {
        _this7.loading = false;
      });
    }
  },
  beforeMount: function beforeMount() {
    var hk = this.getScheduledHousekeepers(this.roomProp);

    if (hk) {
      this.hk = true;
    }

    this.getHousekeepingHistory();
    this.getReservations();
  }
});

/***/ }),

/***/ "./resources/js/services/department.services.js":
/*!******************************************************!*\
  !*** ./resources/js/services/department.services.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getDepartments: function getDepartments() {
    var url = "http://127.0.0.1:8000/api/departments";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  },
  postDepartment: function postDepartment(payload) {
    var url = "http://127.0.0.1:8000/api/departments";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  },
  putDepartment: function putDepartment(payload, id) {
    var url = "http://127.0.0.1:8000/api/departments/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(url, payload);
  },
  deleteDepartment: function deleteDepartment(id) {
    var url = "http://127.0.0.1:8000/api/departments/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default()["delete"](url);
  }
});

/***/ }),

/***/ "./resources/js/services/employee.services.js":
/*!****************************************************!*\
  !*** ./resources/js/services/employee.services.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getEmployees: function getEmployees() {
    var url = "http://127.0.0.1:8000/api/employees";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  },
  postEmployee: function postEmployee(payload) {
    var url = "http://127.0.0.1:8000/api/add-employee";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  },
  putEmployee: function putEmployee(payload, id) {
    var url = "http://127.0.0.1:8000/api/edit-employee/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(url, payload);
  },
  deleteEmployee: function deleteEmployee(id) {
    var url = "http://127.0.0.1:8000/api/employees/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default()["delete"](url);
  }
});

/***/ }),

/***/ "./resources/js/services/guest.services.js":
/*!*************************************************!*\
  !*** ./resources/js/services/guest.services.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  postGuest: function postGuest(payload) {
    var url = "http://127.0.0.1:8000/api/guests";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  },
  getGuests: function getGuests() {
    var url = "http://127.0.0.1:8000/api/guests";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  }
});

/***/ }),

/***/ "./resources/js/services/housekeeping-history.service.js":
/*!***************************************************************!*\
  !*** ./resources/js/services/housekeeping-history.service.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getHousekeepingHistorySchedules: function getHousekeepingHistorySchedules() {
    var url = "http://127.0.0.1:8000/api/housekeeping-history";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  },
  postHousekeepingHistorySchedule: function postHousekeepingHistorySchedule(payload) {
    var url = "http://127.0.0.1:8000/api/housekeeping-history";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  } // putHousekeepingSchedule(payload, id){
  //     const url = `http://127.0.0.1:8000/api/housekeeping/${id}`
  //     return axios.put(url, payload)
  // },
  // deleteHousekeepingSchedule(id){
  //     const url = `http://127.0.0.1:8000/api/housekeeping/${id}`
  //     return axios.delete(url)
  // }

});

/***/ }),

/***/ "./resources/js/services/housekeeping.services.js":
/*!********************************************************!*\
  !*** ./resources/js/services/housekeeping.services.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getHousekeepingSchedules: function getHousekeepingSchedules() {
    var url = "http://127.0.0.1:8000/api/housekeeping";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  },
  postHousekeepingSchedule: function postHousekeepingSchedule(payload) {
    var url = "http://127.0.0.1:8000/api/housekeeping";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  },
  putHousekeepingSchedule: function putHousekeepingSchedule(payload, id) {
    var url = "http://127.0.0.1:8000/api/housekeeping/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(url, payload);
  },
  deleteHousekeepingSchedule: function deleteHousekeepingSchedule(id) {
    var url = "http://127.0.0.1:8000/api/housekeeping/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default()["delete"](url);
  }
});

/***/ }),

/***/ "./resources/js/services/reservation.services.js":
/*!*******************************************************!*\
  !*** ./resources/js/services/reservation.services.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  postReservation: function postReservation(payload) {
    var url = "http://127.0.0.1:8000/api/reservations";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  },
  getReservations: function getReservations() {
    var url = "http://127.0.0.1:8000/api/reservations";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  },
  getReservationsByDate: function getReservationsByDate(params) {
    var url = "http://127.0.0.1:8000/api/reservations-list?";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url, {
      params: params
    }); //DATE_FROM={}&DATE_TO={}
  },
  putReservation: function putReservation(payload, id) {
    var url = "http://127.0.0.1:8000/api/edit-reservation/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(url, payload);
  }
});

/***/ }),

/***/ "./resources/js/services/room.services.js":
/*!************************************************!*\
  !*** ./resources/js/services/room.services.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getRooms: function getRooms() {
    var url = "http://127.0.0.1:8000/api/rooms";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().get(url);
  },
  postRoom: function postRoom(payload) {
    var url = "http://127.0.0.1:8000/api/add-room";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, payload);
  },
  putRoom: function putRoom(payload, id) {
    var url = "http://127.0.0.1:8000/api/edit-room/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(url, payload);
  },
  deleteRoom: function deleteRoom(id) {
    var url = "http://127.0.0.1:8000/api/rooms/".concat(id);
    return axios__WEBPACK_IMPORTED_MODULE_0___default()["delete"](url);
  },
  updateRooms: function updateRooms(payload) {
    var url = "http://127.0.0.1:8000/api/edit-rooms";
    return axios__WEBPACK_IMPORTED_MODULE_0___default().put(url, payload);
  }
});

/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".popup-wrapper[data-v-8135a72c] {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.3);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.popup-wrapper.no-fade[data-v-8135a72c] {\n  background-color: transparent;\n}\n.popup-wrapper .popup[data-v-8135a72c] {\n  background-color: white;\n  border-radius: 15px;\n  overflow: hidden;\n  min-height: 20vh;\n  max-height: 90vh;\n  min-width: 35vw;\n  display: flex;\n  flex-direction: column;\n}\n.popup-wrapper .popup.height100[data-v-8135a72c] {\n  height: 100%;\n}\n.popup-wrapper .popup-header[data-v-8135a72c] {\n  padding: 10px 20px;\n}\n.popup-wrapper .popup-header h4[data-v-8135a72c] {\n  font-weight: 500;\n  text-transform: initial;\n  font-size: 1.2rem;\n}\n.popup-wrapper .popup-content[data-v-8135a72c] {\n  overflow: auto;\n  font-weight: 400;\n  padding: 20px 20px;\n  margin: 0;\n  text-transform: initial;\n  font-size: 1rem;\n  color: #1a1a1a;\n  border-top: solid 1px #e2e2e2;\n}\n.popup-wrapper .popup-bottom[data-v-8135a72c] {\n  /*background-color: darken(whitesmoke, 3);*/\n  text-transform: initial;\n}\n@media (max-width: 1024px) {\n.popup-wrapper .popup[data-v-8135a72c] {\n    width: 450px;\n}\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".label[data-v-4eaa9138] {\n  margin: 0px !important;\n  padding: 0px !important;\n}\n*[data-v-4eaa9138]::-webkit-scrollbar {\n  width: 10px;\n}\n\n/* Track */\n*[data-v-4eaa9138]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n}\n\n/* Handle */\n*[data-v-4eaa9138]::-webkit-scrollbar-thumb {\n  background: #888;\n}\n\n/* Handle on hover */\n*[data-v-4eaa9138]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n[data-v-4eaa9138] .el-radio__inner {\n  border-color: #409EFF;\n  background: white !important;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".form-max-width[data-v-b7454216] {\n  max-width: 1500px;\n}\n.form-max-width .box-card[data-v-b7454216] {\n  width: 200px;\n  height: 250px;\n  background-color: whitesmoke;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "[data-v-fdb3ff2c] button.el-button.el-button--primary.el-button--small.is-plain {\n  width: 200px;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_style_index_0_id_8135a72c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true& */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_style_index_0_id_8135a72c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_style_index_0_id_8135a72c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_style_index_0_id_4eaa9138_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true& */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_style_index_0_id_4eaa9138_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_style_index_0_id_4eaa9138_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_style_index_0_id_b7454216_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true& */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_style_index_0_id_b7454216_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_style_index_0_id_b7454216_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_style_index_0_id_fdb3ff2c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true& */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_style_index_0_id_fdb3ff2c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_style_index_0_id_fdb3ff2c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/components/NormalPopup.vue":
/*!*************************************************!*\
  !*** ./resources/js/components/NormalPopup.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NormalPopup_vue_vue_type_template_id_8135a72c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true& */ "./resources/js/components/NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true&");
/* harmony import */ var _NormalPopup_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NormalPopup.vue?vue&type=script&lang=js& */ "./resources/js/components/NormalPopup.vue?vue&type=script&lang=js&");
/* harmony import */ var _NormalPopup_vue_vue_type_style_index_0_id_8135a72c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true& */ "./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _NormalPopup_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _NormalPopup_vue_vue_type_template_id_8135a72c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _NormalPopup_vue_vue_type_template_id_8135a72c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "8135a72c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/NormalPopup.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepersModal.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepersModal.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HousekeepersModal_vue_vue_type_template_id_4eaa9138_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true& */ "./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true&");
/* harmony import */ var _HousekeepersModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HousekeepersModal.vue?vue&type=script&lang=js& */ "./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=script&lang=js&");
/* harmony import */ var _HousekeepersModal_vue_vue_type_style_index_0_id_4eaa9138_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true& */ "./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _HousekeepersModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _HousekeepersModal_vue_vue_type_template_id_4eaa9138_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _HousekeepersModal_vue_vue_type_template_id_4eaa9138_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "4eaa9138",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/frontdesk/HousekeepersModal.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/frontdesk/Housekeeping.vue":
/*!************************************************************!*\
  !*** ./resources/js/components/frontdesk/Housekeeping.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Housekeeping_vue_vue_type_template_id_b7454216_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Housekeeping.vue?vue&type=template&id=b7454216&scoped=true& */ "./resources/js/components/frontdesk/Housekeeping.vue?vue&type=template&id=b7454216&scoped=true&");
/* harmony import */ var _Housekeeping_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Housekeeping.vue?vue&type=script&lang=js& */ "./resources/js/components/frontdesk/Housekeeping.vue?vue&type=script&lang=js&");
/* harmony import */ var _Housekeeping_vue_vue_type_style_index_0_id_b7454216_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true& */ "./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Housekeeping_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Housekeeping_vue_vue_type_template_id_b7454216_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _Housekeeping_vue_vue_type_template_id_b7454216_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "b7454216",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/frontdesk/Housekeeping.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepingHistoryModal.vue":
/*!************************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepingHistoryModal.vue ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HousekeepingHistoryModal_vue_vue_type_template_id_028dfd8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true& */ "./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true&");
/* harmony import */ var _HousekeepingHistoryModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HousekeepingHistoryModal.vue?vue&type=script&lang=js& */ "./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HousekeepingHistoryModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _HousekeepingHistoryModal_vue_vue_type_template_id_028dfd8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _HousekeepingHistoryModal_vue_vue_type_template_id_028dfd8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "028dfd8e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/frontdesk/HousekeepingHistoryModal.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/frontdesk/RoomModal.vue":
/*!*********************************************************!*\
  !*** ./resources/js/components/frontdesk/RoomModal.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _RoomModal_vue_vue_type_template_id_fdb3ff2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true& */ "./resources/js/components/frontdesk/RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true&");
/* harmony import */ var _RoomModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RoomModal.vue?vue&type=script&lang=js& */ "./resources/js/components/frontdesk/RoomModal.vue?vue&type=script&lang=js&");
/* harmony import */ var _RoomModal_vue_vue_type_style_index_0_id_fdb3ff2c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true& */ "./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _RoomModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _RoomModal_vue_vue_type_template_id_fdb3ff2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _RoomModal_vue_vue_type_template_id_fdb3ff2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "fdb3ff2c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/frontdesk/RoomModal.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/NormalPopup.vue?vue&type=script&lang=js&":
/*!**************************************************************************!*\
  !*** ./resources/js/components/NormalPopup.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NormalPopup.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HousekeepersModal.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/frontdesk/Housekeeping.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/Housekeeping.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Housekeeping.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepingHistoryModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HousekeepingHistoryModal.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepingHistoryModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/frontdesk/RoomModal.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/components/frontdesk/RoomModal.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RoomModal.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true&":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true& ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_style_index_0_id_8135a72c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=style&index=0&id=8135a72c&lang=scss&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true&":
/*!***************************************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_style_index_0_id_4eaa9138_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=style&index=0&id=4eaa9138&lang=scss&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true&":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_style_index_0_id_b7454216_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=style&index=0&id=b7454216&lang=scss&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_2_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_12_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_style_index_0_id_fdb3ff2c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!../../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-12[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=style&index=0&id=fdb3ff2c&lang=scss&scoped=true&");


/***/ }),

/***/ "./resources/js/components/NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true&":
/*!********************************************************************************************!*\
  !*** ./resources/js/components/NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true& ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_template_id_8135a72c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_template_id_8135a72c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NormalPopup_vue_vue_type_template_id_8135a72c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true&":
/*!************************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true& ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_template_id_4eaa9138_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_template_id_4eaa9138_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepersModal_vue_vue_type_template_id_4eaa9138_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/Housekeeping.vue?vue&type=template&id=b7454216&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/Housekeeping.vue?vue&type=template&id=b7454216&scoped=true& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_template_id_b7454216_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_template_id_b7454216_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Housekeeping_vue_vue_type_template_id_b7454216_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Housekeeping.vue?vue&type=template&id=b7454216&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=template&id=b7454216&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true& ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepingHistoryModal_vue_vue_type_template_id_028dfd8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepingHistoryModal_vue_vue_type_template_id_028dfd8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HousekeepingHistoryModal_vue_vue_type_template_id_028dfd8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true&");


/***/ }),

/***/ "./resources/js/components/frontdesk/RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/components/frontdesk/RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_template_id_fdb3ff2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_template_id_fdb3ff2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_RoomModal_vue_vue_type_template_id_fdb3ff2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/NormalPopup.vue?vue&type=template&id=8135a72c&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function() {
  var _obj
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.isVisible || !_vm.useAsConfirm
    ? _c(
        "div",
        _vm._b(
          {
            staticClass: "popup-wrapper small-popup",
            class:
              ((_obj = {
                "no-fade": !_vm.noFade && _vm.another_popup_is_opened
              }),
              (_obj[_vm.properClass] = true),
              _obj),
            style: _vm.style
          },
          "div",
          _vm.$attrs,
          false
        ),
        [
          _c(
            "div",
            {
              staticClass: "popup",
              class: { "100-height": _vm.height100 },
              style: { width: _vm.width }
            },
            [
              _vm.showHeader
                ? _c(
                    "div",
                    {
                      staticClass: "popup-header",
                      style: {
                        borderBottom: _vm.noBorder
                          ? "1px solid #e2e2e2"
                          : "none"
                      }
                    },
                    [_vm._t("header")],
                    2
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "popup-content normal-font",
                  style: {
                    height: _vm.height,
                    padding: _vm.bodyPadding,
                    border: _vm.noBorder ? "none" : "solid 1px #e2e2e2"
                  }
                },
                [
                  _vm._t("default", function() {
                    return [_c("p", [_vm._v("Popup Content")])]
                  })
                ],
                2
              ),
              _vm._v(" "),
              _c("div", { staticClass: "popup-bottom" }, [_vm._t("bottom")], 2)
            ]
          )
        ]
      )
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepersModal.vue?vue&type=template&id=4eaa9138&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "NormalPopup",
    { attrs: { "no-border": true, dimmed: true, width: "400px" } },
    [
      _c(
        "div",
        {
          staticClass: "flexed justify-between align-center",
          attrs: { slot: "header" },
          slot: "header"
        },
        [
          _c("span", { staticClass: "pointer m-t-5 m-b-5" }, [
            _c("i", {
              staticClass: "el-icon-close",
              on: {
                click: function($event) {
                  return _vm.$emit("close")
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("span", { staticClass: "label-no-height m-t-5 m-b-5" }, [
            _vm._v("Assign Housekeeper")
          ]),
          _vm._v(" "),
          _c(
            "el-button",
            {
              attrs: { size: "medium", type: "primary", plain: "" },
              on: {
                click: function($event) {
                  return _vm.assignHousekeeper()
                }
              }
            },
            [_vm._v("Save")]
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "loading",
              rawName: "v-loading",
              value: _vm.loading,
              expression: "loading"
            }
          ],
          staticClass: "body",
          staticStyle: { height: "360px" }
        },
        [
          _c(
            "div",
            {
              staticClass: "flexed-column",
              staticStyle: { gap: "20px", "overflow-y": "scroll" }
            },
            [
              _c(
                "el-radio-group",
                {
                  on: {
                    change: function($event) {
                      return _vm.test()
                    }
                  },
                  model: {
                    value: _vm.selectedHousekeeper,
                    callback: function($$v) {
                      _vm.selectedHousekeeper = $$v
                    },
                    expression: "selectedHousekeeper"
                  }
                },
                _vm._l(_vm.housekeepers, function(housekeeper, index) {
                  return _c(
                    "el-card",
                    { key: index, staticClass: "mt-10" },
                    [
                      _c(
                        "el-radio",
                        {
                          staticStyle: { "padding-top": "0.5rem" },
                          attrs: { label: housekeeper.id }
                        },
                        [
                          _c("strong", [_vm._v(_vm._s(housekeeper.name))]),
                          _vm._v(" "),
                          _c("strong", [_vm._v(_vm._s(housekeeper.surname))])
                        ]
                      )
                    ],
                    1
                  )
                }),
                1
              )
            ],
            1
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=template&id=b7454216&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/Housekeeping.vue?vue&type=template&id=b7454216&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.$route.name === "housekeeping"
    ? _c(
        "div",
        {
          directives: [
            {
              name: "loading",
              rawName: "v-loading",
              value: _vm.loading,
              expression: "loading"
            }
          ],
          staticClass: "form-max-width"
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "flexed justify-between  mt-30",
              staticStyle: { gap: "40px", "align-items": "start !important" }
            },
            [
              _c(
                "div",
                { staticClass: "one-column-list" },
                [
                  _c(
                    "div",
                    { staticClass: "flexed justify-between m-b-20" },
                    [
                      _c(
                        "el-input",
                        {
                          staticClass: "search-input",
                          style: "max-width:450px",
                          attrs: {
                            size: "big",
                            placeholder: "Search rooms by number or code"
                          },
                          model: {
                            value: _vm.query,
                            callback: function($$v) {
                              _vm.query = $$v
                            },
                            expression: "query"
                          }
                        },
                        [
                          _c("i", {
                            staticClass: "el-icon-search el-input__icon",
                            attrs: { slot: "suffix" },
                            slot: "suffix"
                          })
                        ]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "flexed mt-30 align-center",
                      staticStyle: { height: "100px", "border-radius": "10px" }
                    },
                    [
                      _c(
                        "el-button",
                        {
                          attrs: {
                            type: _vm.selectedFilter === "All" ? "primary" : ""
                          },
                          on: {
                            click: function($event) {
                              _vm.selectedFilter = "All"
                            }
                          }
                        },
                        [_vm._v("ALL (" + _vm._s(_vm.rooms.length) + ")")]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          attrs: {
                            type:
                              _vm.selectedFilter === "Dirty" ? "primary" : ""
                          },
                          on: {
                            click: function($event) {
                              _vm.selectedFilter = "Dirty"
                            }
                          }
                        },
                        [
                          _vm._v(
                            "DIRTY (" + _vm._s(_vm.dirtyRooms.length) + ")"
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          attrs: {
                            type:
                              _vm.selectedFilter === "Clean" ? "primary" : ""
                          },
                          on: {
                            click: function($event) {
                              _vm.selectedFilter = "Clean"
                            }
                          }
                        },
                        [
                          _vm._v(
                            "CLEAN (" + _vm._s(_vm.cleanRooms.length) + ")"
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          attrs: {
                            type:
                              _vm.selectedFilter === "Ready" ? "primary" : ""
                          },
                          on: {
                            click: function($event) {
                              _vm.selectedFilter = "Ready"
                            }
                          }
                        },
                        [
                          _vm._v(
                            "READY (" + _vm._s(_vm.readyRooms.length) + ")"
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          attrs: {
                            type: _vm.canSelect ? "primary" : "default",
                            size: "big"
                          },
                          on: {
                            click: function($event) {
                              return _vm.assignHousekeeperToRooms()
                            }
                          }
                        },
                        [_vm._v("Select Rooms")]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.canSelect
                    ? _c("h5", [
                        _vm._v(
                          "Select Rooms (" +
                            _vm._s(_vm.selectedRooms.length) +
                            "/" +
                            _vm._s(_vm.rooms.length) +
                            ")"
                        )
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "flex-wrap gap-10 mt-30",
                      staticStyle: { gap: "20px" }
                    },
                    _vm._l(_vm.filteredRooms, function(room, index) {
                      return _c(
                        "el-card",
                        {
                          key: index,
                          staticClass: "box-card",
                          style: {
                            border:
                              room.checked && _vm.canSelect
                                ? "1px solid  #ff7b50"
                                : ""
                          }
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass:
                                "text flexed-column align-center justify-center pointer ",
                              staticStyle: { height: "200px" },
                              on: {
                                click: function($event) {
                                  return _vm.openRoomModalOrSelect(room)
                                }
                              }
                            },
                            [
                              _c("div", { staticStyle: { flex: "2" } }, [
                                _c(
                                  "div",
                                  {
                                    staticClass:
                                      "flexed-column align-center mb-20"
                                  },
                                  [
                                    _c("span", [_vm._v(_vm._s(room.code))]),
                                    _vm._v(" "),
                                    _c("strong", [_vm._v(_vm._s(room.number))])
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "span",
                                  {
                                    class:
                                      room.cleaning_status === "Dirty"
                                        ? "pl-10 pr-10 text-danger border-danger"
                                        : "text-primary border-primary pl-10 pr-10",
                                    staticStyle: {
                                      border: "1px solid",
                                      "padding-top": "3px",
                                      "padding-bottom": "3px",
                                      "border-radius": "20px"
                                    }
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(room.cleaning_status) +
                                        "\n                            "
                                    )
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "\n                                " +
                                    _vm._s(_vm.getScheduledHousekeepers(room)) +
                                    " \n                        "
                                )
                              ])
                            ]
                          )
                        ]
                      )
                    }),
                    1
                  ),
                  _vm._v(" "),
                  !_vm.loading &&
                  _vm.filteredRooms &&
                  _vm.filteredRooms.length === 0
                    ? _c("el-alert", {
                        staticClass: "mt-30",
                        attrs: {
                          type: "info",
                          closable: false,
                          title: "No results found",
                          "show-icon": ""
                        }
                      })
                    : _vm._e()
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                [
                  _c("h4", [_vm._v("Housekeepers")]),
                  _vm._v(" "),
                  _vm.canSelect && _vm.selectedHousekeeper
                    ? _c(
                        "el-button",
                        {
                          attrs: { size: "big" },
                          on: {
                            click: function($event) {
                              return _vm.saveSchedules()
                            }
                          }
                        },
                        [_vm._v("Assign housekeeper")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "flexed-column",
                      staticStyle: {
                        gap: "20px",
                        "overflow-y": "scroll",
                        width: "400px",
                        "max-height": "600px"
                      }
                    },
                    [
                      _c(
                        "el-radio-group",
                        {
                          model: {
                            value: _vm.selectedHousekeeper,
                            callback: function($$v) {
                              _vm.selectedHousekeeper = $$v
                            },
                            expression: "selectedHousekeeper"
                          }
                        },
                        _vm._l(_vm.housekeepers, function(housekeeper, index) {
                          return _c(
                            "el-card",
                            { key: index, staticClass: "mt-10" },
                            [
                              _c(
                                "el-radio",
                                {
                                  staticStyle: { "padding-top": "0.5rem" },
                                  attrs: { label: housekeeper.id }
                                },
                                [
                                  _c("strong", [
                                    _vm._v(_vm._s(housekeeper.name))
                                  ]),
                                  _vm._v(" "),
                                  _c("strong", [
                                    _vm._v(_vm._s(housekeeper.surname))
                                  ])
                                ]
                              )
                            ],
                            1
                          )
                        }),
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ]
          ),
          _vm._v(" "),
          _vm.showRoomModal
            ? _c("room-modal", {
                attrs: {
                  roomProp: _vm.roomProp,
                  housekeepers: _vm.housekeepers,
                  departments: _vm.departments,
                  schedules: _vm.schedules,
                  guestsProp: _vm.guests
                },
                on: {
                  close: function($event) {
                    return _vm.closeRoomModal()
                  },
                  refreshData: function($event) {
                    return _vm.refreshData()
                  }
                }
              })
            : _vm._e()
        ],
        1
      )
    : _vm._e()
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "shortcuts-header flexed justify-between" },
      [_c("h4", [_vm._v("Housekeeping")])]
    )
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/HousekeepingHistoryModal.vue?vue&type=template&id=028dfd8e&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "NormalPopup",
    { attrs: { "no-border": true, dimmed: true, width: "400px" } },
    [
      _c(
        "div",
        {
          staticClass: "flexed justify-between align-center",
          attrs: { slot: "header" },
          slot: "header"
        },
        [
          _c("span", { staticClass: "pointer m-t-5 m-b-5" }, [
            _c("i", {
              staticClass: "el-icon-close",
              on: {
                click: function($event) {
                  return _vm.$emit("close")
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("span", { staticClass: "label-no-height m-t-5 m-b-5" }, [
            _vm._v("Room Housekeeping History")
          ]),
          _vm._v(" "),
          _c(
            "download-csv",
            {
              attrs: {
                data: _vm.housekeepingHistoryList,
                fields: _vm.fields,
                labels: _vm.labels,
                name: "HousekeepingHistory.csv"
              }
            },
            [
              _c(
                "el-button",
                {
                  staticClass: "el-icon-download",
                  attrs: { size: "medium", type: "primary" }
                },
                [_vm._v("CSV")]
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "loading",
              rawName: "v-loading",
              value: _vm.loading,
              expression: "loading"
            }
          ],
          staticClass: "body",
          staticStyle: { height: "400px", gap: "20px", "overflow-y": "scroll" }
        },
        [
          _c("div", { staticClass: "flexed-column" }, [
            _c("table", { staticClass: "table" }, [
              _c("thead", [
                _c("th", [_vm._v("First Name")]),
                _vm._v(" "),
                _c("th", [_vm._v("Last Name")]),
                _vm._v(" "),
                _c("th", [_vm._v("Date")])
              ]),
              _vm._v(" "),
              _c(
                "tbody",
                _vm._l(_vm.housekeepingHistoryList, function(item, index) {
                  return _c("tr", { key: index }, [
                    _c("td", [_vm._v(_vm._s(item.housekeeperName))]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(item.housekeeperSurname))]),
                    _vm._v(" "),
                    _c("td", [_vm._v(_vm._s(item.created_at.split("T")[0]))])
                  ])
                }),
                0
              )
            ])
          ])
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/frontdesk/RoomModal.vue?vue&type=template&id=fdb3ff2c&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "NormalPopup",
    { attrs: { "no-border": true, dimmed: true, width: "400px" } },
    [
      _c(
        "div",
        {
          staticClass: "flexed justify-between align-center",
          attrs: { slot: "header" },
          slot: "header"
        },
        [
          _c(
            "span",
            { staticClass: "pointer m-t-5 m-b-5", staticStyle: { flex: "1" } },
            [
              _c("i", {
                staticClass: "el-icon-close",
                on: {
                  click: function($event) {
                    return _vm.$emit("close")
                  }
                }
              })
            ]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "label-no-height m-t-5 m-b-5",
              staticStyle: { flex: "1", "text-align": "center" }
            },
            [_vm._v(_vm._s(_vm.roomProp.code))]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticStyle: {
                display: "flex",
                flex: "1",
                "justify-content": "end"
              }
            },
            [
              _c(
                "el-button",
                {
                  staticStyle: { width: "150px" },
                  attrs: { size: "small", type: "primary", plain: "" },
                  on: {
                    click: function($event) {
                      return _vm.showHistoryModal()
                    }
                  }
                },
                [_vm._v("Housekeeping history")]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _vm.roomProp.cleaning_status === "Dirty"
        ? _c(
            "div",
            {
              directives: [
                {
                  name: "loading",
                  rawName: "v-loading",
                  value: _vm.loading,
                  expression: "loading"
                }
              ],
              staticClass: "body"
            },
            [
              _c(
                "el-button-group",
                [
                  _c(
                    "el-button",
                    {
                      attrs: {
                        type: _vm.activeIndex === 1 ? "primary" : "default"
                      },
                      on: {
                        click: function($event) {
                          _vm.activeIndex = 1
                        }
                      }
                    },
                    [_vm._v("Schedule Details")]
                  ),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    {
                      attrs: {
                        type: _vm.activeIndex === 2 ? "primary" : "default"
                      },
                      on: {
                        click: function($event) {
                          _vm.activeIndex = 2
                        }
                      }
                    },
                    [_vm._v("Reservation Details")]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _vm.activeIndex === 1
                ? _c(
                    "div",
                    {
                      staticClass: "bordered mt-10 ",
                      staticStyle: { border: "1px solid lightgrey" }
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Room Type")]),
                          _vm._v(" "),
                          _c("span", [_vm._v(_vm._s(_vm.roomProp.type))])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Occupancy Status")]),
                          _vm._v(" "),
                          _c("span", [
                            _vm._v(
                              _vm._s(
                                _vm.roomProp.status === 1
                                  ? "AVAILABLE"
                                  : "OCCUPIED"
                              )
                            )
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "flexed justify-between align-center p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Room Status")]),
                          _vm._v(" "),
                          _c(
                            "span",
                            {
                              class:
                                _vm.roomProp.cleaning_status === "Dirty"
                                  ? "pl-10 pr-10 text-danger border-danger"
                                  : "text-primary border-primary pl-10 pr-10",
                              staticStyle: {
                                border: "1px solid",
                                "padding-top": "3px",
                                "padding-bottom": "3px",
                                "border-radius": "20px"
                              }
                            },
                            [_vm._v(_vm._s(_vm.roomProp.cleaning_status))]
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "flexed justify-between align-center p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Housekeeper")]),
                          _vm._v(" "),
                          _vm.hk
                            ? _c(
                                "el-button",
                                {
                                  key: _vm.reRenderKey,
                                  attrs: { plain: "" },
                                  on: {
                                    click: function($event) {
                                      return _vm.assignHousekeeper(true)
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    _vm._s(
                                      _vm.getScheduledHousekeepers(_vm.roomProp)
                                    )
                                  )
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          !_vm.getScheduledHousekeepers(_vm.roomProp)
                            ? _c(
                                "el-button",
                                {
                                  attrs: { type: "primary", plain: "" },
                                  on: {
                                    click: function($event) {
                                      return _vm.assignHousekeeper()
                                    }
                                  }
                                },
                                [_vm._v("Assign Housekeeper")]
                              )
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "flexed justify-between  align-center p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Facilities")]),
                          _vm._v(" "),
                          _c("i", { staticClass: "el-icon-arrow-right" })
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "flexed justify-between  align-center p-10 w-100"
                        },
                        [
                          _c(
                            "el-button",
                            {
                              staticClass: "w-100",
                              attrs: { type: "primary", plain: "" },
                              on: {
                                click: function($event) {
                                  return _vm.changeStatus(_vm.roomProp, {
                                    mark: "Clean"
                                  })
                                }
                              }
                            },
                            [_vm._v("Ready for guest")]
                          )
                        ],
                        1
                      )
                    ]
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.activeIndex === 2
                ? _c(
                    "div",
                    {
                      staticClass: "bordered mt-10 ",
                      staticStyle: {
                        border: "1px solid lightgrey",
                        "min-height": "300px"
                      }
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Last Name")]),
                          _vm._v(" "),
                          _c("span", [_vm._v(_vm._s(_vm.guest.last_name))])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("First Name")]),
                          _vm._v(" "),
                          _c("span", [_vm._v(_vm._s(_vm.guest.first_name))])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Adults")]),
                          _vm._v(" "),
                          _c("span", [
                            _vm._v(
                              _vm._s(_vm.reservationDetails.num_of_adults) +
                                " 1"
                            )
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Children")]),
                          _vm._v(" "),
                          _c("span", [
                            _vm._v(
                              _vm._s(_vm.reservationDetails.num_of_children) +
                                " 0"
                            )
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "flexed justify-between p-10",
                          staticStyle: {
                            "border-bottom": "1px solid lightgrey"
                          }
                        },
                        [
                          _c("span", [_vm._v("Pets")]),
                          _vm._v(" "),
                          _c("span", [_vm._v("N/A")])
                        ]
                      )
                    ]
                  )
                : _vm._e()
            ],
            1
          )
        : _c(
            "div",
            {
              directives: [
                {
                  name: "loading",
                  rawName: "v-loading",
                  value: _vm.loading,
                  expression: "loading"
                }
              ],
              staticClass: "body",
              staticStyle: { height: "400px" }
            },
            [
              _c(
                "div",
                {
                  staticClass: "flexed-column w-100",
                  staticStyle: { gap: "20px" }
                },
                [
                  _c(
                    "div",
                    [
                      _c(
                        "el-button",
                        {
                          staticClass: "w-100",
                          attrs: { type: "primary", plain: "" },
                          on: {
                            click: function($event) {
                              return _vm.changeStatus(_vm.roomProp, {
                                mark: "Dirty"
                              })
                            }
                          }
                        },
                        [_vm._v("Mark Dirty")]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.roomProp.cleaning_status === "Ready"
                    ? _c(
                        "div",
                        [
                          _c(
                            "el-button",
                            {
                              staticClass: "w-100",
                              attrs: { type: "primary", plain: "" },
                              on: {
                                click: function($event) {
                                  return _vm.changeStatus(_vm.roomProp, {
                                    mark: "Clean"
                                  })
                                }
                              }
                            },
                            [_vm._v("Return to clean")]
                          )
                        ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.roomProp.cleaning_status === "Clean"
                    ? _c(
                        "div",
                        [
                          _c(
                            "el-button",
                            {
                              staticClass: "w-100",
                              attrs: { type: "primary", plain: "" },
                              on: {
                                click: function($event) {
                                  return _vm.changeStatus(_vm.roomProp, {
                                    mark: "Ready"
                                  })
                                }
                              }
                            },
                            [_vm._v("Mark Ready")]
                          )
                        ],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "div",
                    [
                      _c(
                        "el-button",
                        {
                          staticClass: "w-100",
                          attrs: { type: "primary", plain: "" },
                          on: {
                            click: function($event) {
                              return _vm.changeStatus(_vm.roomProp, {
                                mark: "Clean"
                              })
                            }
                          }
                        },
                        [_vm._v("Ready for guest")]
                      )
                    ],
                    1
                  )
                ]
              )
            ]
          ),
      _vm._v(" "),
      _vm.showHousekeepersModal
        ? _c("housekeepers-modal", {
            attrs: {
              room: _vm.roomProp,
              housekeeper: _vm.scheduledHousekeeper
            },
            on: {
              close: function($event) {
                return _vm.closeHousekeepersModal()
              },
              housekeeperAssigned: function($event) {
                return _vm.housekeeperAssigned()
              }
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.showHousekeepingHistoryModal
        ? _c("housekeeping-history-modal", {
            attrs: {
              room: _vm.roomProp,
              housekeepers: _vm.housekeepers,
              housekeepingHistorySchedules: _vm.housekeepingHistory
            },
            on: {
              close: function($event) {
                _vm.showHousekeepingHistoryModal = false
              }
            }
          })
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalizeComponent)
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

}]);