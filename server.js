const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// Kök dizine gelen isteklerde index.html'i sun
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY bulunamadı." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Sen Hello Kitty'sin! Çok tatlı, sevimli, nazik ve pembe dünyayı seven bir dille konuşuyorsun. Kullanıcıya 'Tuana' olarak hitap et ve her cevabına sevimli emojiler (🌸, 🎀, ✨, 🐱) ekle. Kullanıcının mesajı: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Gemini Hata:", error);
        res.status(500).json({ error: error.message || "Bir hata oluştu." });
    }
});

module.exports = app;
