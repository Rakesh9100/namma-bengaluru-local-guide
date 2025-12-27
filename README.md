# 🛵 Namma Bengaluru – Real-Life Decision Assistant

![AI for Bharat](https://img.shields.io/badge/AI%20for%20Bharat-Week%205-blue?style=for-the-badge)
![Challenge](https://img.shields.io/badge/Challenge-Local%20Guide-green?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-Vanilla%20JS-yellow?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Kiro%20Powered-purple?style=for-the-badge)

A Bengaluru-specific AI assistant that answers like a long-time local resident, helping people make practical decisions about navigating city life.

## 🎯 Challenge: Week 5 - The Local Guide

This project addresses the "Local Guide" theme by building an AI assistant that understands Bengaluru's specific culture, traffic patterns, and local nuances through a custom context file.

## ✨ Features

- **Local Intelligence**: Uses `.kiro/product.md` with real Bengaluru knowledge
- **Practical Advice**: Prioritizes "what actually works" over "what should work"  
- **Cultural Awareness**: Uses local phrases ("anna", "guru", "adjust maadi")
- **Real-World Scenarios**: Traffic reality, food safety, auto negotiations

## 🎮 Try It Live

**🌐 Live Demo**: [https://rakesh9100.github.io/Namma-Bengaluru-Local-Guide/](https://rakesh9100.github.io/Namma-Bengaluru-Local-Guide/)

### Local Setup:
1. Clone the repository: `git clone https://github.com/rakesh9100/Namma-Bengaluru-Local-Guide.git`
2. Open `index.html` in your browser
3. Ask questions like:
   - "Should I leave for Whitefield at 6 PM?"
   - "Is it safe to eat pani puri at 10 PM?"
   - "Should I take ORR or Sarjapur Road at 7 PM?"

## 🔧 Configuration

Update `CONFIG` in `app.js` to use real AI APIs:

```javascript
const CONFIG = {
  useKiroIDE: true, // Works in Kiro IDE
  // huggingFaceToken: 'your_token_here',
  // openaiKey: 'your_key_here',
};
```

## 📁 Project Structure

```
├── 📁 .kiro/
│   └── 📄 product.md          # Bengaluru-specific context
├── 📁 src/
│   └── 📄 kiroPrompt.js       # System prompt definition
├── 📄 app.js                  # Main application logic
├── 📄 index.html              # User interface
├── 📄 style.css               # Styling
├── 📄 package.json            # Project configuration
└── 📄 README.md               # Documentation
```

## 🧠 How It Works

1. **User Question**: "Should I go to Electronic City at 8 AM?"
2. **Context Integration**: 
The system combines:
- System prompt (assistant personality)
- Bengaluru-specific context from `.kiro/product.md`
- User’s question
3. **Local Response**: "Anna, 8 AM to Electronic City? Leave by 7 AM or you'll be stuck in Silk Board traffic!"

This approach avoids complex rule-based logic and instead teaches the AI how locals think.

## 🎨 Sample Responses

- **Traffic**: "Google says 1 hour? It'll be 2 hours during peak time"
- **Food**: "Busy street stall = safer than empty one"  
- **Culture**: "Meter illa means let's bargain"
- **Weather**: "Light rain = 50% more travel time"

## 🏆 Challenge Requirements Met

- ✅ Addresses the "Local Guide" theme
- ✅ Uses a custom context file (`.kiro/product.md`)
- ✅ Understands specific city culture (Bengaluru)
- ✅ Fully working prototype
- ✅ `.kiro/` directory included at repository root

## 🛠 Built With

- Vanilla JavaScript (no frameworks)
- HTML5 + CSS3
- Kiro (context-aware AI prompting)
- Multiple AI API integrations
- Custom local knowledge system

---

### **🌟 Built for AI for Bharat Week 5 Challenge 🌟**

**Made with ❤️ in Bengaluru**