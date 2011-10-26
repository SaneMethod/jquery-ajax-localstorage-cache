# About 
jquery-ajax-jstorage-cache is a plugin build for jQuery (>1.5.1) and [jStorage](http://www.jstorage.info) . It's a client-side cache plugin for AJAX response intended to save bandwith and time. All the responses are stored in the Local Storage powered by HTML5 (see [jStorage#Support](http://www.jstorage.info/#support)).

# How to use 

## Parameters

	$.ajax({
		url: '/post',

		cacheJStorage: true,
		cacheKey: 'post',
		isCacheValid: function(){
			return true;
		},

		success: function(reply) {
			// i can play with my reply ! 
		}
	});

On your AJAX request you got 3 new parameters :

* cache
	* Turn cacheJStorage on/off
	* Default: false
* cacheKey
	* CacheKey is the key that will be used to store the response in jStorage. It allow you to delete your cache easily with the jStorage.removeKey() function.
	* Default: URL + TYPE(GET/POST) + DATA
* isCacheValid
	* This function must return true or false. On false, the cached response is removed.
	* Default: null

## Notes

* You can delete the cache by using jStorage API (see [jStorage#Usage](http://www.jstorage.info/#usage)).
* Note that you can pre-load content with this plugin. You just have do to the same AJAX request without a success callback and the same cacheKey.

# License

This project is distributed under Apache 2 License. See LICENSE.txt for more information.