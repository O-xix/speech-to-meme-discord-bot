# Speech-to-Meme – Discord Bot MVP (CSS 370 Project)

This repository contains documentation and an MVP prototype for **Speech-to-Meme**, a Discord feature concept designed and prototyped by Team 7 (ICBINGO) for **CSS 370 (Software Engineering)** at the University of Washington Bothell.  

## 📖 Project Overview
**Speech-to-Meme** allows Discord users to post memes in text channels using **voice commands** while in a voice channel — no need to alt-tab or lose focus during gaming sessions.  

- Say: `Discord send meme [name]`  
- The bot listens, recognizes the command, and posts the corresponding meme in the configured text channel.  
- Each server can pre-configure its own meme library.  

This project was prototyped as a **Discord bot** and supported by a full **business and design proposal**.  

## ⚙️ Technologies Used
- **TypeScript** – main language for development  
- **Discord.js** – Discord bot API wrapper  
- **Vosk** – speech-to-text engine  
- **Fuse.js** – fuzzy searching for meme recognition  
- **SQLite** – lightweight local meme database  

## 📝 What This Repo Contains
- **Business Proposal (PDF):** Comprehensive report covering system design, architecture, business analysis, and risk assessment.  
- **Extra Credit Presentation (PDF):** Slides summarizing the MVP prototype.  
- **Prototype Bot (Code):** Discord bot that demonstrates core functionality (voice recognition + meme posting).  

## 🔑 Key Features of the MVP
- `/add-server-meme [name] [link]` → Add memes to the database  
- `/remove-server-meme [name]` → Remove memes from the database  
- `/list-server-memes` → List all configured memes  
- `/join` → Have the bot join a voice channel, listen, and process commands  

## 🔑 Key Skills Demonstrated
- Full-stack prototyping (bot development, speech-to-text, database integration)  
- Application of **NLP** and **fuzzy search** techniques  
- Real-time voice processing and command recognition  
- Business analysis and product design documentation  
- Technical communication and system architecture planning  

## 📌 Note
This project was completed as a **class project**. The MVP prototype demonstrates the core idea as a working Discord bot, but is not a production-ready Discord feature.  
This requires a speech-to-text model to be downloaded. See [model/README.md](./model/README.md) for more details.
