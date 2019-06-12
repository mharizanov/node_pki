// Include http ,url module.
var http = require('http');
var url = require('url');

// Create http server.
var httpServer = http.createServer(function(req, resp) {

    var pathName = url.parse(req.url, true, false).pathname;

    // If request login action.
    if ('/req_client_cert' == pathName) {

        if ("POST" == req.method) {
            var postData = '';

            req.on('data', function(chunk) {
                postData += chunk;
            });

            req.on('end', function() {

                var postDataObject = JSON.parse(postData);

				let certificate = (new Buffer(postDataObject.certificate, 'base64')).toString('ascii');
				console.log("certificate:\n"+certificate);

                // TODO: 
                // - CA Intermediate sign
                // - Send final json with base64 encoded certificate
                // resp.end(json);
            })
        }
    }
});

// Http server listen on port 8888.
httpServer.listen(8888);

console.log("Server is started.");