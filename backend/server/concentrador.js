const net = require('net') // Usado para comunicação TCP com concentrador
const platform = require('./config/platform')

const helper = {
    status_pivos: require('./helpers/status_pivos'),
    intencoes: require('./helpers/intencoes')
}

var modulos = []

helper.intencoes.getAll()
    .then(allIntencoes => {
        allIntencoes.forEach(intencao => {
            modulos.push({ modulo_id: intencao.modulo_id, i: 0 })
        })
    })

let concentrador_id = '192.168.100.201'
try {
    localStorage.setItem('concentrador_id', concentrador_id)
} catch{
    console.log('nao deu')
}

module.exports = {
    sincronizarIntencoesComPivos: function () {
        //console.log('---Checando todos os pivos e suas intencoes----')
        helper.intencoes.getAll()
            .then(allIntencoes => {
                allIntencoes.forEach(intencao => {
                    //console.log(`checando modulo: ${intencao.modulo_id}`)
                    var codigoIntencao = ''
                    var codigoChegando = ''
                    var codigoAtual = ''
                    var modulo_id = intencao.modulo_id

                    codigoIntencao += intencao.front_back
                    codigoIntencao += intencao.water
                    codigoIntencao += intencao.on_off

                    if (codigoIntencao[2] == 2) {
                        codigoIntencao = '002'
                    }

                    /* if (intencao.percent < 10 && codigoIntencao[2] != 2) {
                        codigoIntencao += '0'
                        if (!intencao.percent) {
                            codigoIntencao += '0'
                        }
                    } */

                    /*  if (intencao.percent && codigoIntencao[2] != 2) {
                         codigoIntencao += intencao.percent
                     } */

                    let client = new net.Socket();

                    try {
                        client.connect(modulo_id, '192.168.100.201', function () {
                            console.log(`Enviando p/ placa: ${modulo_id} | ${codigoIntencao}`)
                            client.write(Buffer.from(codigoIntencao, 'ascii'));
                            client.on('data', function (resposta) {
                                if (resposta != undefined)
                                    console.log(`Resposta da placa: ${modulo_id} | ${resposta.toString()}`)
                                data = resposta.toString().split('-')                            

                                codigoChegando += data[0]
                                codigoChegando += data[1]
                                codigoChegando += data[2]

                                if (data[3] == 00 || data[2] == 2) {
                                     data[3] = 0
                                }

                                codigoChegando += 0
                                codigoChegando += modulo_id

                                helper.status_pivos.getByModuloId(modulo_id)
                                    .then(res => {

                                        res = res[0].dataValues
                                        codigoAtual += res.front_back
                                        codigoAtual += res.water
                                        codigoAtual += res.on_off
                                        codigoAtual += res.percent
                                        codigoAtual += modulo_id

                                        /* console.log(`Codigo chegando: ${codigoChegando}`)
                                        console.log(`Codigo atual: ${codigoAtual}`)
                                        console.log(`Codigo Intencao: ${codigoIntencao}`) */

                                        // Se chegou informação, desfalhar o status se ele estiver falhado

                                        const updates = {
                                            front_back: data[0],
                                            water: data[1],
                                            on_off: data[2],
                                            percent: 0, //MUDAR DEPOIS PARA DATA[03] !! IMPORTANTE 
                                            volt: 0,
                                            pressure: 0,
                                            fail: 0,
                                        }

                                        if (codigoChegando !== codigoAtual) {
                                            helper.status_pivos.patch(modulo_id, updates)                                            
                                            modulos.forEach(modulo => {
                                                if (modulo.modulo_id === intencao.modulo_id) {
                                                    modulo.i = 0;
                                                }
                                            })
                                        } else {
                                            helper.status_pivos.getByModuloId(modulo_id).then(status_pivo => {
                                                if (status_pivo.fail === 1) {
                                                    console.log('pivo ta falhado, desfalhando...')
                                                    helper.status_pivos.patch(modulo_id, updates)
                                                }
                                            })
                                        }

                                        if (codigoIntencao[0] === codigoChegando[0] && codigoIntencao[1] === codigoChegando[1] && codigoIntencao[2] === codigoChegando[2]) {
                                            helper.intencoes.patchByModuloIdAndUpdates(modulo_id, { on_off: 0, front_back: 0, water: 0, percent: '00' })
                                        }

                                        if (codigoIntencao[2] === '2' && codigoChegando[2] === '2') {
                                            helper.intencoes.patchByModuloIdAndUpdates(modulo_id, { on_off: 0, front_back: 0, water: 0, percent: '00' })
                                        }
                                        
                                        modulos.forEach(modulo => {
                                            console.log('TOeeeeeee AQUI', modulo.modulo_id, codigoIntencao,intencao.modulo_id )
                                            if (modulo.modulo_id === intencao.modulo_id) {
                                                console.log('TO AQUI', modulo.i, codigoIntencao)
                                                if (codigoIntencao !== '000') {
                                                    if (modulo.i < 5) {
                                                        modulo.i++;
                                                        console.log('TO dentro', modulo.i)
                                                    } else {
                                                        modulo.i = 0;
                                                        helper.intencoes.patchByModuloIdAndUpdates(modulo_id, { on_off: 0, front_back: 0, water: 0, percent: '00' })
                                                    }
                                                }
                                            }
                                        })
                                    })
                            })
                        })
                        client.on('error', err => {
                            helper.status_pivos.getByModuloId(modulo_id)
                                .then(status => {

                                    if (status[0].dataValues.fail !== 1) {
                                        helper.status_pivos.patch(modulo_id, { fail: 1 })
                                    }
                                })
                            console.log(`Erro de conexao no modulo: ${modulo_id}`)
                        })


                    } catch (e) {
                        console.log('erro ao conectar com concentrador')
                        console.log(e)
                    }
                })
            })
    },

    publishAll: async function () {
        const allStatus = await helper.status_pivos.getAll()

        allStatus.forEach(status => {
            console.log(`${status.front_back}-${status.water}-${status.on_off}-${status.fail}-${status.modulo_id}`)
            const json = {
                modulo_id: status.modulo_id,
                front_back: status.front_back,
                water: status.water,
                on_off: status.on_off,
                percent: status.percent,
                fail: status.fail
            }
            platform.publish(json)
        })
    }
}
