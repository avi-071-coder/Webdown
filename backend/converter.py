import markdown
import re
from bs4 import BeautifulSoup

class MarkdownConverter:
    def __init__(self):
        self.md = markdown.Markdown(extensions=['extra', 'fenced_code', 'tables'])
    
    def convert(self, markdown_text, theme='blog'):
        if not markdown_text.strip():
            return '<p style="color:#9ca3af; text-align:center; padding:3rem; font-style:italic;">Write markdown to see magic ✨</p>', '', '0 min', 0
        
        html = self.md.convert(markdown_text)
        
        # Clean up and add theme
        soup = BeautifulSoup(html, 'html.parser')
        theme_map = {'blog': 'theme-blog', 'portfolio': 'theme-portfolio', 'docs': 'theme-docs'}
        theme_class = theme_map.get(theme, 'theme-blog')
        
        # Wrap in body with theme
        body = soup.new_tag('body', **{'class': theme_class})
        for child in soup.find_all(recursive=False):
            body.append(child)
        
        toc = self.extract_toc(html)
        reading_time = self.calculate_reading_time(markdown_text)
        word_count = self.count_words(markdown_text)
        
        return str(body), toc, reading_time, word_count
    
    def extract_toc(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        toc_items = []
        for i, tag in enumerate(soup.find_all(['h1', 'h2', 'h3'])):
            if i < 5 and tag.get('id'):
                level = 'h4' if tag.name == 'h3' else 'h3'
                toc_items.append(f'<li><a href="#{tag["id"]}">{tag.get_text()}</a></li>')
        
        if toc_items:
            return f'<div class="toc"><h4>On this page</h4><ul>{"".join(toc_items)}</ul></div>'
        return ''
    
    def calculate_reading_time(self, text):
        words = self.count_words(text)
        minutes = max(1, int(words / 200))
        return f"{minutes} min"
    
    def count_words(self, text):
        clean = re.sub(r'[^\w\s]', ' ', text)
        return len(re.findall(r'\b\w+\b', clean))