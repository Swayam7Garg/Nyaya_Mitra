# Project To-Do & Limitations

Here are the things that I was not able to fully implement or fully test locally, due to the constraints of the environment and time:

1. **Chat System & LLM (Gemini API):**
   All AI features require a valid `GEMINI_API_KEY` in your `backend/.env` file. The multi-turn chat system (`GeminiChat` component) uses the `/api/ai/chat` backend endpoint which requires this key to be set. Without a valid key, the chat will show a connection error.

2. **MongoDB Atlas Connection:**
   The backend connects to MongoDB via the `MONGODB_URI` environment variable. You will need to replace the placeholder connection string in `backend/.env` with your actual MongoDB connection string. The app gracefully falls back to static data if the backend is unavailable.

3. **Hindi Typography in jsPDF:**
   The base logic for jsPDF has been provided. Displaying full complex Devanagari (Hindi) fonts cleanly within `jsPDF` often requires loading a custom `.ttf` file as base64 in the VFS (Virtual File System) and registering it. Currently the PDF is generated in English; a full Hindi PDF would require injecting a valid Noto Sans Devanagari font in base64 format.

4. **Animations & Micro-interactions:**
   While the structure uses smooth CSS transitions, incorporating complex state-based animations (like page transitions or large layout morphs) with Framer Motion would require wrapping the application components more deeply, which might complicate standard Server Side Rendering for Next.js.

You'll need to add the following secrets securely in `backend/.env` before launching:
- `GEMINI_API_KEY` — Get from Google AI Studio (aistudio.google.com)
- `MONGODB_URI` — Your MongoDB Atlas connection string
