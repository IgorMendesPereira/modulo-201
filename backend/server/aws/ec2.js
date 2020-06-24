const db = require('../config/db')
const awsIot = require('aws-iot-device-sdk');
const helper = {
  status_pivos: require('../helpers/status_pivos')
}

// IMPORTANTE
// Ao importar esse arquivo, nao esqueça de chamar a função setup()
// para dar inicio ao processo!

// The device module exports an MQTT instance, which will attempt     
// to connect to the AWS IoT endpoint configured in the arguments.     
// Once connected, it will emit events which our application can     
// handle.  

var device
var allIntencoes = []

module.exports = {
  setup: function () {
    device = awsIot.device({
      keyPath: './server/aws/5a2a236a6a-private.pem.key',
      certPath: './server/aws/Certificado.crt',
      caPath: './server/aws/RootCA.txt',
      clientId: 'LeanEeC2',
      region: 'us-­east-­one',// the AWS IoT region you will operate in (default 'us­east­1')
      // Região onde os certificados foram criados!
      baseReconnectTimeMs: '1000',
      protocol: 'mqtts',
      port: '8883',
      host: 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com' //Copiado HTTPS endPoint     
    })
  },

  start: function () {
    //Esse código usa REST e o endPoint acima, para invocar serviço. O HTTP usado leva mensagens de MQTT.
    //Dessa forma fica possível enviar dado para um tópico de fila, usando mensagens MQTT carregadas no HTTP.        
    //o serviço REST no Gateway acata as mensagens HTTP e sabe o que fazer com o conteúdo MQTT.
    device.subscribe('$aws/things/Coisa-X/shadow/update/update')

    console.log('Preparando AWS IoT na AWS...');
    device
      .on('message', function (topic, payload, data) {
        var message = JSON.parse(payload) //Ex: {"type":"status_pivos","modulo_id":"10003","on_off":2,"front_back":4,"water":5,"percent":0,"fail":0}

        if (message['type'] === 'status_pivos') {
          const {
            modulo_id,
            on_off,
            front_back,
            water,
            percent,
            fail
          } = message

          console.log('fazendo aqui!!')
          helper.status_pivos.patch(modulo_id, { on_off, front_back, water, percent, fail, pressure: 0, volt: 0 })
          module.exports.respond({ modulo_id, on_off, front_back, water, percent, fail })
        } else if (message['type'] === 'resp_intencoes') {
          const {
            modulo_id,
            on_off,
            front_back,
            water,
            percent,
          } = message

          const newIntencao = {
            modulo_id,
            on_off,
            front_back,
            water,
            percent,
          }

          allIntencoes.forEach((intencao, index, array) => {
            if (module.exports.equals(intencao.intencao, newIntencao)) {
              array.splice(index, 1)
            }
          })
        }
      })
  },

  equals: function (intencao, resp_intencao) {
    if (intencao.modulo_id === resp_intencao.modulo_id &&
      intencao.on_off === resp_intencao.on_off &&
      intencao.front_back === resp_intencao.front_back &&
      intencao.water === resp_intencao.water &&
      intencao.percent === resp_intencao.percent &&
      intencao.fail === resp_intencao.fail) return true;

    return false;
  },

  addMessage: function (object) {
    const newObject = {
      intencao: object,
      responded: false
    }

    allIntencoes.push(newObject)
  },

  check: function () {
    allIntencoes.forEach(intencao => {
      console.log(intencao)
      if (intencao.responded === false) {
        this.publish(intencao.intencao)
      }
    })
  },

  publish: function (json) {
    console.log('publicando intencao... ')

    const newJson = {
      type: 'intencoes',
      ...json
    }
    //console.log("intencao:" + JSON.stringify(newJson))


    device.publish('$aws/things/Coisa-X/shadow/update/accepted/acc', JSON.stringify(newJson))
  },

  respond: function (json) {
    //console.log('publicando resposta: ')

    const newJson = {
      type: 'resp_status',
      ...json
    }

    device.publish('$aws/things/Coisa-X/shadow/update/accepted/acc', JSON.stringify(newJson))
  }
}