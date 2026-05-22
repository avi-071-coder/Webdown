import os
from google import genai
from google.genai import types

class AIFormatter:
    def __init__(self):
        # The client will automatically pick up GOOGLE_API_KEY from environment variables
        self.client = genai.Client()

    def format_text(self, text):
        prompt = f"""
You are an expert editor.
Your task is to take the provided plain text and beautifully structure it using ONLY Markdown.

Follow these strict rules:
1. **NO HTML**: You must NEVER output raw HTML tags (like <div>, <span>, <hr>, <p>). Return ONLY standard Markdown syntax (# for headers, * for lists, > for quotes, ** for bold, etc).
2. **DO NOT INVENT CONTENT**: You must only edit, rephrase, or format what the user has written. Do NOT add new facts or ideas. You can improve the flow, grammar, and engagement, but the core meaning must remain exactly what the user provided.
3. **Beautiful Structure**: Use Markdown creatively to make the text look great. 
    - Use H1 (#) for the main title.
    - Use H2 (##) or H3 (###) to separate ideas.
    - Use blockquotes (>) to highlight important statements.
    - Use bold (**) to emphasize key words.
4. **Output**: Return ONLY the raw Markdown. Do not include conversational filler like "Here is the result:". Do not wrap the whole thing in markdown code blocks like ```markdown.

Here is the raw notes/text to transform:

{text}
"""
        response = self.client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text.strip()
