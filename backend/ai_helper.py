import re
from textstat import flesch_reading_ease

class LocalAIHelper:
    def analyze_quality(self, markdown_text):
        # Better text cleaning for analysis
        text = re.sub(r'`.*?`|\$.*?\$.*?\$|#{1,6}\s|[^\w\s\.\!\?]', ' ', markdown_text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        readability = flesch_reading_ease(text) if text.strip() else 0
        headings = len(re.findall(r'^#{1,6}\s', markdown_text, re.M))
        lists = len(re.findall(r'^\s*[-*+]\s', markdown_text, re.M))
        sentences = len(re.findall(r'[.!?]+', text)) or 1
        words = len(re.findall(r'\b\w+\b', text))
        paragraphs = len(re.findall(r'\n\s*\n', markdown_text))
        
        suggestions = self.generate_suggestions(headings, lists, sentences, words, readability, paragraphs)
        score = self.calculate_score(readability, headings, lists, sentences, words, paragraphs)
        
        return {
            'score': round(score),
            'readability': round(readability, 1),
            'quality_label': self.get_label(score),
            'suggestions': suggestions,
            'word_count': words,
            'sentence_count': sentences,
            'paragraphs': paragraphs
        }
    
    def calculate_score(self, readability, headings, lists, sentences, words, paragraphs):
        base = 40
        readability_score = min(30, readability / 3)
        structure_score = min(15, headings * 4) + min(10, lists * 2)
        content_score = min(15, sentences * 2) + min(10, paragraphs * 2)
        length_penalty = -10 if words > 1500 else 0
        return min(100, base + readability_score + structure_score + content_score + length_penalty)
    
    def generate_suggestions(self, headings, lists, sentences, words, readability, paragraphs):
        suggestions = []
        
        if headings < 2:
            suggestions.append("📝 Add 2-3 headings (##) to organize content better")
        if lists == 0:
            suggestions.append("• Use bullet points (-) for key points and lists")
        if readability < 60:
            suggestions.append(f"✏️ Simplify sentences (current: {round(readability)} → aim for 60+)")
        if words > 1000:
            suggestions.append("📄 Consider breaking long content into multiple sections")
        if sentences < 3:
            suggestions.append("💡 Add more complete sentences for better flow")
        if paragraphs < 2:
            suggestions.append("¶ Add paragraph breaks (double enter) for readability")
        if headings > 8:
            suggestions.append("⚖️ Reduce headings - keep hierarchy simple (3-5 max)")
        
        if not suggestions:
            suggestions.append("✅ Excellent structure! Content quality looks great!")
        return suggestions[:4]
    
    def get_label(self, score):
        if score >= 90: return "🎉 Excellent"
        elif score >= 75: return "👍 Great"
        elif score >= 60: return "✅ Good"
        elif score >= 40: return "⚠️ Fair"
        return "📝 Needs Work"