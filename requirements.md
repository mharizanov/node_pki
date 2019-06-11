The purpose of this project is to create pair of scripts that help provision IoT devices (e.g. ESP32) with unique client certificates.

The below flow represents roughly (WIP) the concept:
![Flow diagram](https://raw.githubusercontent.com/mharizanov/node_pki/master/PKI_flow_diagram.png)

"ESP32" in the above diagram represents the device to be programmed.
"laptop" in the above diagram represents the computer that is used to program and provision the "ESP32" devices.
"cloud" represents a private virtual server on the cloud, accessible by domain name.

There will be two distinct components that will run on the laptop and the cloud respectively (client-server).

The script running on the latop will create a private key (RSA 2048)
The script running on the latop will create a CSR that will be sent to the script running on the cloud for signing and in return will expect a client certificate.
The script running on the latop will take as parameter the device MAC address.
The MAC address provided as a parameter to the script running on the latop will be used as CommonName field in the CSR.
... wip
