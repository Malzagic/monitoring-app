const http = require("http");
const os = require("os");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

function getSystemData() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = ((1 - freeMem / totalMem) * 100).toFixed(1);

  const cpus = os.cpus();
  const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const total = cpus.reduce(
    (acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq + cpu.times.idle,
    0
  );

  return {
    cpu: (100 - (idle / total) * 100).toFixed(1),
    ram: usedMem,
    disk: (Math.random() * 100).toFixed(1), // Podmień na realną wartość
  };
}

wss.on("connection", ws => {
  const interval = setInterval(() => {
    ws.send(JSON.stringify(getSystemData()));
  }, 2000);

  ws.on("close", () => clearInterval(interval));
});

server.listen(20604, () => {
  console.log("WebSocket server running on port 3000");
});
