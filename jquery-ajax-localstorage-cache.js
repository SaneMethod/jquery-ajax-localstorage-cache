/**
 * https://github.com/SaneMethod/jquery-ajax-localstorage-cache
 */
; (function($, window){
    'use strict';

    /**
     * Generate the cache key under which to store the local data - either the cache key supplied,
     * or one generated from the url, the type and, if present, the data.
     */
    var genCacheKey = function(options) {
        var url;

        // If cacheKey is specified, and a function, return the result of calling that function
        // as the cacheKey. Otherwise, just return the specified cacheKey as-is.
        if (options.cacheKey){
            return (typeof options.cacheKey === 'function') ?
                options.cacheKey(options) : options.cacheKey;
        }

        url = options.url.replace(/jQuery.*/, '');

        // Strip _={timestamp}, if cache is set to false
        if (options.cache === false) {
            url = url.replace(/([?&])_=[^&]*/, '');
        }

        return url + options.type + (options.data || '');
    };

    /**
     * Determine whether we're using localStorage or, if the user has specified something other than a boolean
     * value for options.localCache, whether the value appears to satisfy the plugin's requirements.
     * Otherwise, throw a new TypeError indicating what type of value we expect.
     * @param {boolean|object} storage
     * @returns {boolean|object}
     */
    var getStorage = function(storage){
        if (!storage) return false;
        if (storage === true) return window.localStorage;
        if (typeof storage === "object" && 'getItem' in storage &&
            'removeItem' in storage && 'setItem' in storage)
        {
            return storage;
        }
        throw new TypeError("localCache must either be a boolean value, " +
            "or an object which implements the Storage interface.");
    };

    /**
     * Remove the item specified by cacheKey and its attendant meta items from storage.
     * @param {Storage|object} storage
     * @param {string} cacheKey
     */
    var removeFromStorage = function(storage, cacheKey){
        storage.removeItem(cacheKey);
        storage.removeItem(cacheKey + 'cachettl');
        storage.removeItem(cacheKey + 'dataType');
    };

    /**
     * Prefilter for caching ajax calls.
     * See also $.ajaxTransport for the elements that make this compatible with jQuery Deferred.
     * New parameters available on the ajax call:
     * localCache   : true // required - either a boolean (in which case localStorage is used), or an object
     * implementing the Storage interface, in which case that object is used instead.
     * cacheTTL     : 5,           // optional - cache time in hours, default is 5.
     * cacheKey     : 'post',      // optional - key under which cached string will be stored.
     * isCacheValid : function  // optional - return true for valid, false for invalid.
     * isResponseValid: function // optional - return true to cache response, false to skip caching response.
     * thenResponse: function // optional - chains on request to potentially alter the response data that
     * gets stored - must return whatever you want stored.
     * @method $.ajaxPrefilter
     * @param options {Object} Options for the ajax call, modified with ajax standard settings.
     * @param orginalOptions {object} Options for ajax as specified in the original call.
     * @param jqXHR {jQuery.xhr} jQuery ajax object.
     */
    $.ajaxPrefilter(function(options, originalOptions, jqXHR){
        var storage = getStorage(options.localCache),
            hourstl = options.cacheTTL || 5,
            cacheKey = options.cacheKey = genCacheKey(options),
            cacheValid = options.isCacheValid,
            responseValid = options.isResponseValid,
            thenResponse = options.thenResponse || null,
            ttl,
            dataType,
            value;

        if (!storage) return;
        ttl = storage.getItem(cacheKey + 'cachettl');

        value = storage.getItem(cacheKey);

        if (value){
            dataType = options.dataType || storage.getItem(cacheKey + 'dataType') || 'text';
            if (dataType.toLowerCase().indexOf('json') !== -1) value = JSON.parse(value);
        }

        if (cacheValid && typeof cacheValid === 'function' && !cacheValid(value)){
            removeFromStorage(storage, cacheKey);
            value = null;
            ttl = 0;
        }

        if (ttl && ttl < +new Date()){
            removeFromStorage(storage, cacheKey);
            ttl = 0;
        }

        if (!value){
            // If value not in the cache, add a then block to request to store the results on success.
            jqXHR.then(thenResponse).then(function(data, status, jqXHR){
                var strdata = data,
                    dataType = options.dataType || jqXHR.getResponseHeader('Content-Type') || 'text/plain';

                if (!(responseValid && typeof responseValid === 'function' && !responseValid(data, status, jqXHR))) {

                    if (dataType.toLowerCase().indexOf('json') !== -1) strdata = JSON.stringify(data);

                    // Save the data to storage catching exceptions (possibly QUOTA_EXCEEDED_ERR)
                    try {
                        storage.setItem(cacheKey, strdata);
                        // Store timestamp and dataType
                        storage.setItem(cacheKey + 'cachettl', +new Date() + 1000 * 60 * 60 * hourstl);
                        storage.setItem(cacheKey + 'dataType', dataType);
                    } catch (e) {
                        // Remove any incomplete data that may have been saved before the exception was caught
                        removeFromStorage(storage, cacheKey);
                        console.log('Cache Error:'+e, cacheKey, strdata);
                    }
                }
            });
        }
    });

    /**
     * This function performs the fetch from cache portion of the functionality needed to cache ajax
     * calls and still fulfill the jqXHR Deferred Promise interface.
     * See also $.ajaxPrefilter
     * @method $.ajaxTransport
     * @params options {Object} Options for the ajax call, modified with ajax standard settings and our
     * cacheKey for this call as determined in prefilter.
     */
    $.ajaxTransport("+*", function(options){
        if (options.localCache)
        {
            var cacheKey = options.cacheKey,
                storage = getStorage(options.localCache),
                dataType = options.dataType || storage.getItem(cacheKey + 'dataType') || 'text',
                value = (storage) ? storage.getItem(cacheKey) : false;

            if (value){
                // In the cache? Get it, parse it to json if the dataType is JSON,
                // and call the completeCallback with the fetched value.
                if (dataType.toLowerCase().indexOf('json') !== -1) value = JSON.parse(value);
                return {
                    send: function(headers, completeCallback) {
                        var response = {};
                        response[dataType] = value;
                        completeCallback(200, 'success', response, '');
                    },
                    abort: function() {
                        console.log("Aborted ajax transport for json cache.");
                    }
                };
            }
        }
    });
})(jQuery, window);
