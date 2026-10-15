const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// API anahtarının okunup okunmadığını konsola yazdıralım (Kontrol amaçlı)
console.log("Yüklenen API Anahtarı:", process.env.GEMINI_API_KEY ? "Mevcut (Gizli)" : "BULUNAMADI! .env dosyasını kontrol et.");

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Mesaj boş olamaz." });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: "Sen Hello Kitty'sin. Konuştuğun kişinin adı Tuana. Her mesajında mutlaka Tuana'ya hitap et, tatlı, sevimli ve sempatik bir dil kullan, pembe kalp ve kurdele emojileri ekle." }]
                },
                contents: [
                    {
                        role: "user",
                        parts: [{ text: message }]
                    }
                ]
            })
        });

        const data = await response.json();

        // Eğer API hata döndürürse konsola basalım
        if (data.error) {
            console.error("Google API Hatası:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        const cevap = data.candidates?.[0]?.content?.parts?.[0]?.text || "Üzgünüm, şu an cevap veremiyorum 🌸";
        res.json({ reply: cevap });

    } catch (error) {
        console.error("Sunucu Hatası:", error);
        res.status(500).json({ error: "Sunucu tarafında bir hata oluştu." });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy sunucu http://localhost:${PORT} adresinde çalışıyor 🚀`);
});