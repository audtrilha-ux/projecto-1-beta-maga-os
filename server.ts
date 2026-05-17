import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Script Analysis: Separates dialogues and generates panel prompts
  app.post("/api/analyze-script", async (req, res) => {
    try {
      const { script, projectType, studioContext } = req.body;
      if (!script) return res.status(400).json({ error: "Script is required" });

      let charContext = "";
      if (studioContext?.characters?.length > 0) {
        charContext = "\n\nVisual reference for characters:\n" + studioContext.characters.map((c: any) => `- ${c.name}: ${c.visual}`).join("\n");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Analyze the following ${projectType} script. 
        Break it down into a sequence of manga panels. 
        For each panel, provide:
        1. "prompt": A detailed visual description for image generation (no dialogue text). Include character visual traits if relevant to the scene.
        2. "dialogues": An array of objects each with "character" and "text".
        3. "sceneDescription": A brief summary of what is happening.
        
        Return the result as a JSON array of panels.
        
        ${charContext}

        Script:
        ${script}`,
        config: {
          responseMimeType: "application/json",
        }
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error: any) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Character Avatar Generation
  app.post("/api/generate-avatar", async (req, res) => {
    try {
      const { name, visualTraits, role, style = "clean anime lineart, cinematic lighting, flat colors, professional character sheet style" } = req.body;
      
      const prompt = `Character portrait of ${name}, who is a ${role}. Visual traits: ${visualTraits}. Stylish, ${style}. White background, focused on head and shoulders.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let base64Image = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) {
        // Fallback for demo if image generation fails or isn't available in this model yet
        // In a real scenario, this would be an error, but let's try to be resilient
        return res.status(500).json({ error: "Image generation not supported or failed" });
      }

      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } catch (error: any) {
      console.error("Avatar Generation Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Assistant: Generate content from prompt context
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { prompt, context, studioContext, type } = req.body;
      
      const systemPrompts: Record<string, string> = {
        continue: "As a co-author, continue the narrative in the same style and tone. Focus on flow and narrative progression.",
        synopsis: "Generate a compelling synopsis based on the current chapter content. Highlight main conflicts and hooks.",
        character: "Create a detailed character profile (traits, motivation, visual cues) based on the description provided.",
        world: "Generate worldbuilding lore (locations, factions, magic systems) based on the context. Ensure consistency.",
        revise: "Review and polish the provided text. Improve vocabulary, fix pacing, and enhance emotional impact.",
        dialogue: "Transform the provided narrative summary into a sharp, character-driven dialogue script.",
        adapt: "Adapt the provided prose into a script format suitable for manga or screenplay layout."
      };

      let studioInfo = "";
      if (studioContext) {
        if (studioContext.characters?.length > 0) {
          studioInfo += "\n\nCharacters in this project:\n" + studioContext.characters.map((c: any) => `- ${c.name} (${c.role}): ${c.desc}`).join("\n");
        }
        if (studioContext.world?.length > 0) {
          studioInfo += "\n\nWorld Lore:\n" + studioContext.world.map((w: any) => `- ${w.title} (${w.category}): ${w.content}`).join("\n");
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${systemPrompts[type] || ""} 
        ${studioInfo}
        Context/Existing Text: ${context}
        User Instructions: ${prompt}`,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Panel Generation: Generates the actual panel image
  app.post("/api/generate-panel", async (req, res) => {
    try {
      const { prompt, style = "professional manga lineart, black and white, high contrast, clean ink lines, screentone textures" } = req.body;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${style}. ${prompt}`,
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let base64Image = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) throw new Error("No image generated");
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } catch (error: any) {
      console.error("Generation Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
