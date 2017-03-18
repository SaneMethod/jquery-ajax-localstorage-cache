Jalc
----
jquery-ajax-localstorage-cache - abbreviated Jalc from here on, because the full name is a mouthful.

Jalc is a plugin built for jQuery (> 1.5.1) and any object implementing the
[storage interface](https://developer.mozilla.org/en-US/docs/Web/API/Storage), such as
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

It's built on a fork from the [jStorage-dependent original](https://github.com/nectify/jquery-ajax-jstorage-cache).
It provides a client-side cache for AJAX responses intended to save bandwith and time.

#### Looking for a version that supports binary data ([Blobs](https://developer.mozilla.org/en/docs/Web/API/Blob), [ArrayBuffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer))? [Check out Jalic](https://github.com/SaneMethod/jalic).

#### Looking for a version that offers caching for the new [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)? [Check out fetchCache](https://github.com/SaneMethod/fetchCache).

# Usage

## Parameters
```javascript
	$.ajax({
		url          : '/post',
		localCache   : true,        // Required. Either a boolean, in which case localStorage will be used, or
		                            // an object that implements the Storage interface.

		cacheTTL     : 1,           // Optional. In hours.
		cacheKey     : 'post',      // optional.
		isCacheValid : function(){  // optional.
			return true;
		}
	}).done(function(response){
	    // The response is available here.
	});
```
On your AJAX request you get 4 new parameters :

* localCache
	* Turn localCache on/off, or specify an object implementing the Storage interface to use.
	* Default: false
* cacheTTL
    * time in hours the entry should be valid. 
    * only for this specific ajax request
    * Default : 5 hours
* cacheKey
	* CacheKey is the key that will be used to store the response in localStorage. It allow you to delete your cache easily with the localStorage.removeItem() function.
	* A callback function can also be used to return dynamically generated cacheKey. ajax options are passed to this callback, but keep in mind that the function needs to return a stable cacheKey - that is, for a given set of parameters, the function should always return the same generated cacheKey.
	* Default: URL + TYPE(GET/POST) + DATA
* isCacheValid
	* This function must return true or false. On false, the cached response is removed.
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
