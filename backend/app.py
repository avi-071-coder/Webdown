# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from converter import MarkdownConverter
# from models import ProjectManager

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# converter = MarkdownConverter()
# projects = ProjectManager()

# @app.route('/convert', methods=['POST'])
# def convert():
#     data = request.json or {}
#     html, toc, time, word_count = converter.convert(
#         data.get('markdown', ''), 
#         data.get('theme', 'blog')
#     )
#     return jsonify({
#         'html': html, 
#         'toc': toc, 
#         'time': time, 
#         'word_count': word_count
#     })

# @app.route('/projects', methods=['GET', 'POST'])
# def projs():
#     if request.method == 'POST':
#         d = request.json
#         return jsonify({'id': projects.create(d['name'], d['content'], d['theme'])})
#     return jsonify(projects.list_projects())

# @app.route('/project/<pid>', methods=['GET', 'PUT'])
# def proj(pid):
#     if request.method == 'PUT':
#         projects.update(pid, **request.json)
#         return jsonify({'ok': True})
#     return jsonify(projects.get(pid))

# if __name__ == '__main__':
#     app.run(debug=True, port=5000, host='127.0.0.1')


from flask import Flask, request, jsonify
from flask_cors import CORS
from converter import MarkdownConverter
from models import ProjectManager
from ai_formatter import AIFormatter
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Hide Flask/Werkzeug logs
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

converter = MarkdownConverter()
projects = ProjectManager()
ai_formatter = AIFormatter()

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json or {}
    html, toc, time, word_count = converter.convert(
        data.get('markdown', '')
    )
    return jsonify({
        'html': html, 
        'toc': toc, 
        'time': time, 
        'word_count': word_count
    })

@app.route('/ai-format', methods=['POST'])
def ai_format():
    data = request.json or {}
    text = data.get('text', '')
    if not text:
        return jsonify({'markdown': ''})
    try:
        markdown_text = ai_formatter.format_text(text)
        return jsonify({'markdown': markdown_text})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/projects', methods=['GET', 'POST'])
def projs():
    if request.method == 'POST':
        d = request.json
        return jsonify({'id': projects.create(d['name'], d['content'])})
    return jsonify(projects.list_projects())

@app.route('/project/<pid>', methods=['GET', 'PUT', 'DELETE'])
def proj(pid):
    if request.method == 'DELETE':
        success = projects.delete(pid)
        return jsonify({'success': success})
    if request.method == 'PUT':
        projects.update(pid, **request.json)
        return jsonify({'ok': True})
    return jsonify(projects.get(pid))

if __name__ == '__main__':
    print("Webdown Backend Started Successfully!")
    print("-> Running on http://127.0.0.1:5000")
    app.run(debug=False, port=5000, host='127.0.0.1')