
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.static(__dirname));

app.use(cors({
    origin: [
        "https://hello-kitty-surpriz.web.app",
        "http://localhost:5000"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


// API kontrolü
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Hello Kitty API çalışıyor! 🎀"
    });
});

// Tarayıcıdan GET isteği geldiğinde açıklama göster
app.get("/api/chat", (req, res) => {
    res.json({
        message: "Sohbet API'si hazır. Mesaj göndermek için POST kullan."
    });
});

// Yapay zekâ sohbeti
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body || {};

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Mesaj boş olamaz."
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY Vercel ayarlarında bulunamadı."
            });
        }

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{
                        text: "Sen Hello Kitty'sin. Konuştuğun kişinin adı Tuana. Ona nazik, sevimli ve sempatik bir dille hitap et. Pembe kalp ve kurdele emojileri kullan."
                    }]
                },
                contents: [{
                    role: "user",
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API hatası:", data);
            return res.status(response.status).json({
                error: data.error?.message || "Gemini API isteği başarısız."
            });
        }

        const cevap =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        res.json({
            reply: cevap || "Şu an cevap veremiyorum 🌸"
        });

    } catch (error) {
        console.error("Sunucu hatası:", error);

        res.status(500).json({
            error: "Sunucu tarafında bir hata oluştu."
        });
    }
});

// Vercel uygulamayı buradan alır
module.exports = app;
