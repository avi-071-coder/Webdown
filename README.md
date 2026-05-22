# Webdown

Webdown is an intelligent, incredibly fast, AI-powered writing application. It takes your messy notes and instantly transforms them into beautifully structured Markdown and standalone HTML web pages using Google's Gemini 2.5 Flash model.

---

## Setup & Installation

1. **Clone the Repository** to your local machine.
2. **Install Python Packages**:
   Navigate to the `backend` folder and install dependencies:
   ```bash
   cd Webdown/backend
   pip install -r requirements.txt
   ```
3. **Configure API Key**:
   Create a `.env` file inside the `backend` folder and add your Gemini API key:
   ```env
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

---

## How to Run

You will need two terminal windows to start both the backend and frontend servers.

**1. Start the Backend API**
```bash
cd backend
python app.py
```

**2. Start the Frontend Application**
Open a **second terminal window**:
```bash
cd frontend
python -m http.server 8080
```

**3. Start Writing!**
Open your web browser and navigate to:
**[http://localhost:8080](http://localhost:8080)**

---

## Usage Guide

1. **Write Rough Notes**: Type your unformatted thoughts directly into the editor. 
2. **Beautify**: Click **Beautify Page** to instantly restructure and format your text.
3. **Save**: Click **Save** to name your project. After your first manual save, the app will **auto-save** all subsequent edits.
4. **Export**: Click **Export HTML** to download a beautiful, standalone `.html` file of your document.
