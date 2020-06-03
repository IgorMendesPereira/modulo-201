const db = require('../config/db')
const deviceModule = require('aws-iot-device-sdk').device;
const helper = {
    intencoes: require('../helpers/intencoes')
}


// IMPORTANTE
// Ao importar esse arquivo, nao esqueça de chamar a função setup()
// para dar inicio ao processo!

// The device module exports an MQTT instance, which will attempt     
// to connect to the AWS IoT endpoint configured in the arguments.     
// Once connected, it will emit events which our application can     
// handle.  

var device
var allStatus = []

module.exports = {
    setup: function () {
        device = deviceModule({
            keyPath: './server/aws/5a2a236a6a-private.pem.key',
            certPath: './server/aws/Certificado.crt',
            caPath: './server/aws/RootCA.txt',
            clientId: 'teste',
            region: 'us-­east-­one',// the AWS IoT region you will operate in (default 'us­east­1')
            // Região onde os certificados foram criados!  
            baseReconnectTimeMs: '1000',
            protocol: 'mqtts',
            port: '8883',
            host: 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com', //Copiado HTTPS endPoint     
            keepalive: 3
        });

        /* device
            .on('close', function () {
                console.log('close');
            });
        device
            .on('reconnect', function () {
                console.log('reconnect');
            });
        device
            .on('offline', function () {
                console.log('offline');
            });
        device
            .on('error', function (error) {
                console.log('error', error);
            }); */
    },

    start: function () {
        //Esse código usa REST e o endPoint acima, para invocar serviço. O HTTP usado leva mensagens de MQTT.
        //Dessa forma fica possível enviar dado para um tópico de fila, usando mensagens MQTT carregadas no HTTP.        
        //o serviço REST no Gateway acata as mensagens HTTP e sabe o que fazer com o conteúdo MQTT.
        device.subscribe('$aws/things/Coisa-X/shadow/update/accepted/acc')

        console.log('Preparando AWS IoT na BeagleBone...');
        device
            .on('message', function (topic, payload, data) {
                var message = JSON.parse(payload)

                if (message['type'] === 'intencoes') {

                    const {
                        modulo_id,
                        on_off,
                        front_back,
                        water,
                        percent,
                    } = message

                    const updates = {
                        on_off,
                        front_back,
                        water,
                        percent
                    }

                    console.log('Intencao recebida na beaglebone: ', topic, payload.toString());

                    helper.intencoes.patch(modulo_id, updates)
                    module.exports.respond({ modulo_id, on_off, front_back, water, percent })
                } else if (message['type'] === 'resp_status') {
                    const {
                        modulo_id,
                        on_off,
                        front_back,
                        water,
                        percent,
                        fail
                    } = message

                    const newStatus = {
                        modulo_id,
                        on_off,
                        front_back,
                        water,
                        percent,
                        fail
                    }

                    allStatus.forEach((status, index, array) => {
                        if (module.exports.equals(status.status, newStatus)) {
                            array.splice(index, 1)
                        }
                    })
                }
            })
    },

    equals: function (status, resp_status) {
        if (status.modulo_id === resp_status.modulo_id &&
            status.on_off === resp_status.on_off &&
            status.front_back === resp_status.front_back &&
            status.water === resp_status.water &&
            status.percent === resp_status.percent &&
            status.fail === resp_status.fail) return true;

        return false;
    },

    addMessage: function (object) {
        const newObject = {
            status: object,
            responded: false
        }

        allStatus.push(newObject)
    },

    check: function () {
        //console.log('checking se status foram respondidas na bb...')
        allStatus.forEach(status => {
            if (status.responded === false) {
                //console.log('status nao respondida.. republioshing')
                this.publish(status.status)
            }
        })
    },

    publish: function (json) {
        console.log('publicando status... ')

        const newJson = {
            type: 'status_pivos',
            ...json
        }
        //console.log("status:" + JSON.stringify(newJson))


        device.publish('$aws/things/Coisa-X/shadow/update/update', JSON.stringify(newJson))
    },

    respond: function (json) {
        //console.log('publicando resposta: ')

        const newJson = {
            type: 'resp_intencoes',
            ...json
        }

        device.publish('$aws/things/Coisa-X/shadow/update/update', JSON.stringify(newJson))
    }
}