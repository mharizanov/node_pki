var fs = require("fs");
var forge = require('node-forge');


function generate_certificate(mac) {

    return new Promise(function(resolve, reject) {
        // console.log('Generating 2048-bit key-pair...');
        var keys = forge.pki.rsa.generateKeyPair(2048);
        // console.log('Key-pair created.');

        // console.log('Creating self-signed certificate...');
        var cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = '01';
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        var attrs = [{
            name: 'commonName',
            value: mac
        }];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);

        // self-sign certificate
        cert.sign(keys.privateKey /*, forge.md.sha256.create()*/ );
        // console.log('Certificate created.');

        // PEM-format keys and cert
        var pem = {
            privateKey: forge.pki.privateKeyToPem(keys.privateKey),
            publicKey: forge.pki.publicKeyToPem(keys.publicKey),
            certificate: forge.pki.certificateToPem(cert)
        };

        // console.log('\nKey-Pair:');
        // console.log(pem.privateKey);
        // console.log(pem.publicKey);

        // console.log('\nCertificate:');
        // console.log(pem.certificate);

        // verify certificate
        var caStore = forge.pki.createCaStore();
        caStore.addCertificate(cert);
        try {
            forge.pki.verifyCertificateChain(caStore, [cert],
                function(vfd, depth, chain) {
                    if (vfd === true) {
                        // console.log('Certificate verified.');
                        resolve(pem);
                    }
                    return true;
                });
        } catch (ex) {
            reject('Certificate verification failure: ' +
                JSON.stringify(ex, null, 2));
        }

    });
}

module.exports = generate_certificate;