# Project To-Do & Limitations

Here are the things that I was not able to fully implement or fully test locally, due to the constraints of the environment and time:

1. **Backend LLM Integration (OpenAI API):** 
   While the frontend API calls and structures are set up, the actual LLM-powered backend processing requires a valid \`OPENAI_API_KEY\` in your \`backend/.env\` file. If the key is invalid or runs out of credits, it might fall back to an error or the frontend might show a fallback state.

2. **MongoDB Atlas Connection:** 
   The backend connects to MongoDB via the \`MONGODB_URI\` environment variable. You will need to replace the placeholder connection string in \`backend/.env\` with your actual MongoDB connection string to fetch dynamic data for situations and lawyers. Currently, the database is populated by seed scripts when it is empty, but this requires a functioning MongoDB instance.

3. **Complete Hindi Typography in jsPDF:**
   The base logic for jsPDF has been provided. However, displaying full complex Devanagari (Hindi) fonts cleanly within \`jsPDF\` often requires loading a custom `.ttf` file as base64 in the VFS (Virtual File System) and registering it. While the placeholder logic is there, you may need to ensure a valid Noto Sans Devanagari TTF file base64 is actually injected if the raw Hindi text doesn't map perfectly in the generated PDF.

4. **Animations & Micro-interactions details:**
   While the structure uses basic CSS transitions that are smooth, incorporating complex state-based animations (like page transitions or large layout morphs) with Framer Motion would require wrapping the application components more deeply, which might complicate standard Server Side Rendering for NextJS.

You'll need to update the secrets securely in your \`.env\` files before launching!
