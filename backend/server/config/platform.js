//Esse arquivo é usado para setar a plataforma em que esse codigo esta instalado,
//Por exemplo, na aws algumas funções como setar a intencao é diferente na aws e na beaglebone, 
//Nesse exemplo, as quando se da patch na intencao esse caminho será feito:

//     [arquivo_arquivo].funcao
//AWS: router_intencoes->helper_intencoes->aws_ec2.publish
//EC2: router_intencoes->helper_intencoes->banco de dados

//Nesse caso, a diferenciação ira ocorrer no arquivo de helper_intencoes, onde por via
//desse arquivo (platform.js), sera consultada a plataforma atual e o proximo passo a ser dado.
var currentPlatform = null
var currentOption = null

const options = {
    ec2: 'ec2',
    bb: 'bb'
}

const platform = {}
platform.options = options
platform.setPlatform = function (platform, option) {
    currentPlatform = platform
    currentOption = option
}
platform.getOption = function () {
    return currentOption
}
platform.setup = function () {
    currentPlatform.setup()
}
platform.start = function () {
    currentPlatform.start()
},
    platform.publish = function (json) {
        currentPlatform.publish(json)
    },
    platform.check = function () {
        currentPlatform.check()
    },
    platform.addMessage = function (object) {
        currentPlatform.addMessage(object)
    },
    platform.equals = function (status, resp_status) {
        currentPlatform.equals(status, resp_status)
    }

module.exports = platform;