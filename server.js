
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Hello Kitty API çalışıyor! 🎀"
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body || {};

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY bulunamadı."
            });
        }

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "Lütfen bir mesaj yaz."
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const result = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents:
                "Sen Hello Kitty temalı, sevimli ve nazik bir asistansın. " +
                "Türkçe konuş, uygun yerlerde 🌸 🎀 ✨ 🐱 emojileri kullan. " +
                "Kullanıcıya Tuana diye hitap et. Mesaj: " +
                message.trim()
        });

        res.json({
            reply: result.text
        });
    } catch (error) {
        console.error("Gemini Hatası:", error.message);

        res.status(500).json({
            error: "Yanıt oluşturulamadı. Lütfen tekrar dene."
        });
    }
});

module.exports = app;
