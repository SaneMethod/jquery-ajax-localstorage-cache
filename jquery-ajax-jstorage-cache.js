$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  // Cache it ?
  if( ! options.cache )
    return;

  var cacheKey;
  // If cacheKey exist we take it, or default one will be used
  if ( options.cacheKey )
    cacheKey = options.cacheKey;
  else 
     cacheKey = options.url + options.type + options.data;
  
  // isCacheValid is a function to validate cache
  if( options.isCacheValid &&  ! options.isCacheValid() ){
    $.jStorage.deleteKey( cackeKey );
  }
  
  if( $.jStorage.get ( cacheKey ) ){
    //In the cache? So get it, apply success callback & abort the XHR request
    options.success( $.jStorage.get ( cacheKey ) );
    // Abort is broken on JQ 1.5 :(
    jqXHR.abort();
  }else{
    //If it not in the cache, we change the success callback, just put data on jStorage and after that apply the initial callback
    if( options.success ) {
      var successhandler = options.success;
      
      options.success = function( data ) {
        $.jStorage.set( cacheKey, data );
        successhandler( data );
      }
    }else{
       options.success = function( data ) {
         $.jStorage.set( cacheKey, data );
       }
    }
  }
});