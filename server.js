const https = require("https");
const app = require("./app");

const fs = require("fs");
const key = fs.readFileSync("./ssl/key.pem");
const cert = fs.readFileSync("./ssl/cert.pem");

const normalizePort = val =>{
    const port = parseInt(val, 10);
    
    if (isNaN(port)){
        return val;
    }
    if (port >= 0){
        return port
    }
    return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = error => {
    if(error.syscall !=="listen") {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port: " + port;
    switch (error.code){
        case "EACCES":
            console.log(bind + "requires elevated privileges.");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = https.createServer({key, cert}, app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
