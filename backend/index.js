//OLHA AQUI QUIQUITO, FILHO MEU
//MUDAR TODOS OS AXIOS e FETCH para HOSTNAME em production e para DEV mudar para IP

//TODO: Nao esqueca de setar a plataforma!! use: platform.setPlaform()
//As opcoes estao no mesmo arquivo, platforms.options.ec2 ou platform.options.bb
//Ex: platform.setPlatform(platform.options.ec2)

require('es6-promise').polyfill(); // Necessario para utilizar Promises (.then)
const concentrador = require('./server/concentrador');

const express = require('express');
const db = require('./server/config/db.js');
const router = require('./server/router/index');

const app = express();
const PORT = 3308;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

//TODO: IMPORTANTE setar a plataforma!!
const platform = require('./server/config/platform');
platform.setPlatform(require('./server/aws/bb'), platform.options.bb);
platform.setup();
platform.start();

var server = require('http').createServer(app); //Cria um servidor HTTP com as definicoes do express

app.use(bodyParser.urlencoded({ extended: true })); //Body parser faz o parse do body da requisicao
app.use(bodyParser.json());
app.use(morgan('combined')); //Printa no console as operacoes de HTTP
app.use(cors());
app.use(express.static(path.join(__dirname, 'build'))); // Adiciona o diretorio pra acesso estatico
//app.use(express.static(path.join(__dirname, 'client')))

const buildPath = path.join(__dirname, 'build', 'index.html');
router.addRoutes(buildPath, app, db); //Seta todas as rotas a serem usadas

/*Sincroniza todos os modelos definidos e adicionados ao db,
importante ser feito isto antes de qualquer modificao ou possivel 
interacao com o banco de dados.
Pode ser utilizado como:
db.sequelize.sync({force: true}).then ... no caso de voce mudar 
algum modelo de alguma tabela e precise reseta-la para aplicar 
as mudancas
*/



db.sequelize.sync().then(() => {
  server.listen(PORT, err => {
    if (err) {
      console.log('Erro ao colocar servidor para ouvir', err);
    } else {
      console.log('Express listening on port:', PORT);
    }
  });
});

const localIpUrl = require('local-ip-url');
localIpUrl()

console.log("Ip BE", localIpUrl())

const socket = require('./server/socket'); //Integra o servidor socket io com o nosso servidor HTTP
socket.setup(server);
socket.start();

if (platform.getOption() === platform.options.bb) {
  console.log('Plataforma detectada: BB')

  setInterval(() => {
    concentrador.sincronizarIntencoesComPivos();
  }, 5000);

  setInterval(() => {
    concentrador.publishAll()
  }, 60000)
}

setInterval(() => {
  platform.check()
}, 10000)

//TESTE DE NOTIFICAÇÃO:
//Cria uma notificação e a envia para ser mostrada
// const publicVapidKey = 'BJk8BUb5Cp8DsSZC7m5BPaveaRID5YSi--gv_Ai8DP8anshJ1st9EIgWsw5I3iP4DrUKGbNRW7Nk0QSJNJoEXA8';
// const privateVapidKey = 'gXFCzayEev3o_j5AS4Us3f--UrbdFb0TzDSMEBGmdjM';
// webpush.setVapidDetails('mailto:igor.mendes@soiltech.com.br', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json()
  const payload = JSON.stringify({ title: 'Pivo Alterado' })
  webpush.sendNotification(subscription, payload).catch(err => console.error(err))
});

