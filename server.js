const app = require('./app');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { socketServer } = require('./socket');

const PORT = 7000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:7000"
    }
});

const chatNameSpace = io.of("/chat");

const  main = async () => {
    try {
        httpServer.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
        await socketServer(chatNameSpace);
    } catch (error) {
        console.log(error.message);
    }
}

main();