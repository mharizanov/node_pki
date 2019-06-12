var spawn = require('child_process').spawn,
    join = require('path').join,
    resolve = require('path').resolve;

function get_mac(port = false) {
    var scriptpath = resolve(join(__dirname, '../esptool/esptool.py'));

    args = [scriptpath];
    if (port) {
        args.push('-p');
        args.push(port);
    }
    args.push('read_mac');

    var command = spawn('python', args);

    return new Promise(function(resolve, reject) {
        var buffer;
        command.stdout.on('data', function(data) {
            // Serial port /dev/cu.SLAB_USBtoUART
            // Connecting........_
            // Detecting chip type... ESP32
            // Chip is ESP32000000 (revision 1)
            // Features: WiFi, BT, Dual Core, 240MHz, VRef calibration in efuse, Coding Scheme None
            // MAC: ff:ff:ff:ff:ff:ff
            // Uploading stub...
            // Running stub...
            // Stub running...
            // MAC: ff:ff:ff:ff:ff:ff
            // Hard resetting via RTS pin...
            buffer += data;
            //console.log('Data: '+data);
        });

        command.stderr.on('data', function(data) {
            // console.log('ERROR: ' + data);
        });

        command.on('close', function(code) {
            if (code || buffer.indexOf('Detecting chip type...') === false) {
                reject('No ESP found');
            } else {
                // console.log('Detected ESP!!!!');
                var mac = buffer.indexOf('MAC: ');
                mac = buffer.slice(mac + 5, mac + 22);
                resolve(mac);
            }
        });
        command.on('error', function(err) {
            reject(err);
        })
    });
}

module.exports = get_mac;