Jalc
----
jquery-ajax-localstorage-cache - abbreviated Jalc from here on, because the full name is a mouthful.

Jalc is a plugin built for jQuery (>= 1.5.1 for 1.x.x, and >=3.0.0 for 2.x.x) and any object implementing the
[storage interface](https://developer.mozilla.org/en-US/docs/Web/API/Storage), such as
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), providing
a client-side cache for AJAX responses intended to save bandwith and time.

Versions tagged 1.x.x support jQuery 1.5.1+ up to jQuery version 3.0.0. Version 1.x.x is no longer receiving
any updates, except bug fixes as needed.

Versions tagged 2.x.x support jQuery 3.0.0+.

#### Looking for a version that supports binary data ([Blobs](https://developer.mozilla.org/en/docs/Web/API/Blob), [ArrayBuffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))? [Check out Jalic](https://github.com/SaneMethod/jalic).

#### Looking for a version that offers caching for the new [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)? [Check out fetchCache](https://github.com/SaneMethod/fetchCache).

# Bower
You can download and install this plugin using bower:
```
bower install jalc
```

You can also download the minified distribution version and install manually in your application:
[jalc.min.js](https://raw.githubusercontent.com/SaneMethod/jquery-ajax-localstorage-cache/master/dist/jalc.min.js).

# Usage

## Parameters

```javascript
$.ajax({
    url: '/post',
    localCache: true,        // Required. Either a boolean, in which case localStorage will be used, or
                             // an object that implements the Storage interface.

    cacheTTL: 1,           // Optional. In hours. Can be used with float to indicate part of an hour, e.g. 0.5.
    cacheKey: 'post',      // optional.
    isCacheValid: function (data) {  // optional.
        return data && data.code === '0';
    },
    isResponseValid: function (data, status, jqXHR) {  // optional.
        return data.code === '0';
    },
    thenResponse: function (data, status, jqXHR) { // optional, only in versions 2.x.x+
        // Alter data in whatever way you want it altered before it gets cached.
        data.code = 101;
        return data;
    }
}).done(function (response) {
    // The response is available here.
});
```

On your AJAX request you get 6 new parameters :

* localCache
	* Turn localCache on/off, or specify an object implementing the Storage interface to use.
	* Default: false
* cacheTTL
    * How long, in hours, the cached values should be considered valid.
    * Floats can be used to indicate some part of an hour, e.g. `0.5` to indicate half-an-hour.
    * Applies to cacheKey specified/calculated - each cached object will respect it's own cacheTTL, there is no
    'global' TTL timer for all cached objects.
    * Default : 5 hours
* cacheKey
	* CacheKey is the key that will be used to store the response in localStorage.
	* A callback function can also be used to return dynamically generated cacheKey. Ajax options are passed to
	this callback, but keep in mind that the function needs to return a stable cacheKey - that is, for a given set
	of parameters, the function should always return the same generated cacheKey.
	* Default: URL + TYPE(GET/POST) + DATA (coerced to string)
* isCacheValid
	* This function must return true or false. On false, the cached response is removed.
	* Default: null
* isResponseValid
    * This function must return a 'truthy' value (boolean, or coercable to boolean). On falsey, the response
    from the server is not cached.
    * Default: null
* thenResponse
    * This function must return the data to be passed on to the next `then` or `done` block. Allows you to specify
    a function which will alter the data in some way before caching it and returning it. Keep in mind that this
    function will NOT be called when fetching from the cache, only when fetching from remote, so don't rely on it
    to perform a transformation that you want to occur every time you make the ajax call - those should instead go
    in a `then` block on your `ajax` request.
    * Default: null

## Notes

* You can delete the cache by using ```localStorage.clear()```, or by using ```localStorage.removeItem('cacheKey')```
if you specified a cacheKey. Note the above assumes you're using localStorage - replace as appropriate with your
Storage interface implementing object.
* You can pre-load content with this plugin. You just have do to an initial AJAX request with the same
cacheKey.
* In most cases, you can rely on the 'intelligent guess' for the
[dataType jQuery ajax parameter](http://api.jquery.com/jquery.ajax/), and leave off the ```dataType``` parameter,
and the plugin will store the content type returned from the server alongside the data. However, you will
 get more consistent results if you explicitly specify the dataType in the ajax parameters.


# License

This project is distributed under Apache 2 License. See LICENSE.txt for more information.
