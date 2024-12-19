import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
    restartOnAuthFail: true,
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html",
    },
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
        ],
    },
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
    console.log("QR Code generated: ");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", (msg) => {
    console.log("Received message:", msg.body);
});

export default async function handler(req:any, res:any) {
    try {
        await client.initialize();
        res.status(200).send("Bot initialized successfully.");
    } catch (error) {
        console.error("Error initializing bot:", error);
        res.status(500).send("Error initializing bot.");
    }
}
