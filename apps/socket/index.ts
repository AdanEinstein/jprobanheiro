import { WebSocket, WebSocketServer } from "ws";
import { Client, Message, MessageType } from "@jprobanheiro/types";
import { createServer } from "http";
import { getClients, updateClients } from "./database";

const server = createServer()

const wsServer = new WebSocketServer({ server })

let sockets: WebSocket[] = []

wsServer.on('listening', () => {
  console.log(`WebSocket conectado ${JSON.stringify(server.address(), null, 2)}`);
})

wsServer.on('connection', (socket) => {

  sockets.push(socket)

  socket.on('message', function (msg) {
    const parsed = JSON.parse(msg.toString()) as Message

    getClients()
      .then(clients => {
        let newClients = clients
        if (parsed?.type == MessageType.ENTER && !!parsed.client) {
          newClients.push(parsed.client)
        }

        if (parsed?.type == MessageType.LEAVE) {
          newClients = clients.filter(c => c.id !== parsed.client?.id)
        }

        if (parsed?.type == MessageType.REFRESH) {
          socket.send(JSON.stringify(clients))
        }

        if (parsed?.type == MessageType.UPDATE) {
          newClients = clients.map(c => {
            if (c.id == parsed.client?.id) {
              return parsed.client
            }
            return c
          })
          socket.send(JSON.stringify(newClients))
        }

        sockets.forEach(s => {
          console.log("WebSocket enviando mensagem");
          console.log("Atualizando sockets");

          s.send(JSON.stringify(newClients))
        })

        updateClients(newClients)
          .then(() => console.log("Banco atualizado!"))
          .catch(err => console.error(`Erro para atualizar o banco: ${err}`))
      })
      .catch(err => console.error(`Erro para obter dados do banco: ${err}`))

  })

  socket.on('close', function () {
    console.log("WebSocket fechando conexão mensagem");
    sockets = sockets.filter(s => s !== socket);
  });
})

const port = 8080

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});