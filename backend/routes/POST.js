function HTTP_POST(e) { 
  
  var endpoint = Sheetbase.Request.param(e, 'e');

  // override home route
  if(!endpoint)
    return Sheetbase.Response.json({
      title: 'Simple Blog Backend',
      greeting: 'Hello world!' 
    });

  if(!Sheetbase.Request.isAuthorized(e)) {
    return Sheetbase.Response.unauthorized();
  } else {
  
    // custom routes
    // switch(endpoint) {
      //   default: break;
    // }
    
    // default routes
    return Sheetbase.POSTRoute.defaults(e);  
  }

}

var PostOutput = {
};