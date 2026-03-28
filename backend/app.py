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

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

converter = MarkdownConverter()
projects = ProjectManager()

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json or {}
    html, toc, time, word_count = converter.convert(
        data.get('markdown', ''), 
        data.get('theme', 'blog')
    )
    return jsonify({
        'html': html, 
        'toc': toc, 
        'time': time, 
        'word_count': word_count
    })

@app.route('/projects', methods=['GET', 'POST'])
def projs():
    if request.method == 'POST':
        d = request.json
        return jsonify({'id': projects.create(d['name'], d['content'], d['theme'])})
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
    app.run(debug=True, port=5000, host='127.0.0.1')