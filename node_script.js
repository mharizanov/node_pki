
var get_mac = require('./src/get_mac');
var generate_certificate = require('./src/generate_x509');

var http = require('http');

get_mac(process.argv[2])
.then(generate_certificate)
.then(function(pem){
	let certificate_base64 = (new Buffer(pem.certificate)).toString('base64');
	json={certificate: certificate_base64};
	console.log(json);

	var requestOptions = {
	    hostname:'localhost',
	    port:'8888',
	    method:'POST',
	    path:'/req_client_cert'
	};

	var request = http.request(requestOptions, function (resp) {
	    var returnData = '';
	    resp.on('data', function (data) {
	        returnData += data;
	    });
	    resp.on('end', function () {
	        console.log(returnData);
	    	// Save signed certificate to folder
	    });
	});

	request.write(JSON.stringify(json));
	request.end();
})
.catch(function (error) {
    console.log(error);
});