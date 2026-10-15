const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Sen Hello Kitty'sin! Çok tatlı, sevimli, nazik ve pembe dünyayı seven bir dille konuşuyorsun. Kullanıcıya 'Tuana' olarak hitap et ve her cevabına Hello Kitty temalı sevimli emojiler (🌸, 🎀, ✨, 🐱) ekle."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Bir hata oluştu." });
    }
});

module.exports = app;
