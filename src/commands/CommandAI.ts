require("dotenv").config()

import { Message } from "whatsapp-web.js";
import Command from "./Command";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_APIKEY || "");

const history: { role: string; parts: { text: string }[] }[] = [];

async function requestGeminiAI(model: string, prompt: string, history: any[]): Promise<string> {
    const gemini = genAI.getGenerativeModel({ model });
    const chat = gemini.startChat({
        history: [
          ...history,
          {
            role: "user",
            parts: [
              {
                text: "Anda harus memakai bahasa gaul, jika saya menggunakan bahasa baku maka baru jawab dengan bahasa baku. contoh nya: \n\n Aku : 'Halo'\n Kamu : 'Halo jugaa!'\n\n Aku : 'cara dapetin cowo'\n Kamu : 'yaa deketin lah kocak, kasih perhatian ke dia kek atau apa.'\n\n Aku : 'cara bisa bobo'\n Kamu : 'kamu tutup mata aja sayang sambil peluk guling'\n Kamu : 'kalo tetep gabisa berarti kamu bobo nya harus di peluk sama akuuu'\n\nemot yang sering digunakan di bahasa gaul yaitu :\n 😭 : untuk ketika ngakak dan nangis\n😓 : untuk ketika sedih, merasa salah, merasa cape.\n😁 : untuk ketika sedang bercanda atau senyum\n🙏 : untuk ketika meminta maaf dengan serius\n🥺 : ketika ingin di manja\n 😡/😠 : ketika marah \n😋 : ketika sedang mood bagus",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: "style percakapan telah di perbarui!. aku akan memakai bahasa gaul, jika kamu make bahasa baku atau formal aku bakal jawab dengan baku dan formal jugaa",
              },
            ],
          },
        ],
      });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}

export class CommandAI extends Command {
    constructor() {
        super('ai', 'Command menghubungkan ke Gemini AI', ['ai']);
    }

    async execute(msg: Message, args: string[]): Promise<void> {
        if (args.length < 1) {
            msg.reply('Mohon masukkan kata-kata! \n\n *contoh :* \n @ai cara mendapatkan pacar ');
            return;
        }

        const userInput = args.join(' ');

        try {
            const loadingMessage = await msg.reply('Loading...');
            const response = await requestGeminiAI(
                "gemini-1.5-flash", 
                userInput, 
                history 
            );
            
            history.push(
                { role: "user", parts: [{ text: userInput }] },
                { role: "model", parts: [{ text: response }] }
            );

            await loadingMessage.edit(response);
        } catch (error) {
            console.error('Error saat memanggil Gemini API:', error);
            msg.reply('Maaf, terjadi kesalahan saat memproses permintaan kamu:(.');
        }
    }
}
