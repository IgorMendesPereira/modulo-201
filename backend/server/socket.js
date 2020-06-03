
var io

module.exports = {
  setup: function (server) {
    io = require('socket.io')(server);
  },

  start: function () {
    io.on("connection", socket => {
      socket.on('update_status', (status) => {
        io.emit('update_status', status)
      })

      socket.on("disconnect", (socket) => {
        /* console.log('Socket desconectado: ')
        console.log(socket) */
      })
    })
  },

  emit: function (event, data) {
    io.emit(event, data)
  }
}

