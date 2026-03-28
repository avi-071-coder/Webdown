# import json
# import os
# from datetime import datetime

# class ProjectManager:
#     def __init__(self):
#         self.file = os.path.join(os.path.dirname(__file__), 'projects.json')
#         self.projects = self.load()
    
#     def load(self):
#         if os.path.exists(self.file):
#             try:
#                 with open(self.file, 'r') as f:
#                     return json.load(f)
#             except:
#                 return {}
#         return {}
    
#     def save(self):
#         try:
#             os.makedirs(os.path.dirname(self.file), exist_ok=True)
#             with open(self.file, 'w') as f:
#                 json.dump(self.projects, f, indent=2)
#         except:
#             pass
    
#     def create(self, name, content, theme):
#         pid = f"p{len(self.projects)}_{int(datetime.now().timestamp())}"
#         self.projects[pid] = {
#             'name': name,
#             'content': content,
#             'theme': theme,
#             'created': datetime.now().isoformat()
#         }
#         self.save()
#         return pid
    
#     def update(self, pid, **kwargs):
#         if pid in self.projects:
#             self.projects[pid].update(kwargs)
#             self.projects[pid]['updated'] = datetime.now().isoformat()
#             self.save()
#             return True
#         return False
    
#     def get(self, pid):
#         return self.projects.get(pid, {})
    
#     def delete(self, pid):
#         if pid in self.projects:
#             del self.projects[pid]
#             self.save()
#             return True
#         return False
    
#     def list_projects(self):
#         return list(self.projects.values())



import json
import os
from datetime import datetime

class ProjectManager:
    def __init__(self):
        self.file = os.path.join(os.path.dirname(__file__), 'projects.json')
        self.projects = self.load()
    
    def load(self):
        if os.path.exists(self.file):
            try:
                with open(self.file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def save(self):
        try:
            os.makedirs(os.path.dirname(self.file), exist_ok=True)
            with open(self.file, 'w') as f:
                json.dump(self.projects, f, indent=2)
        except:
            pass
    
    def create(self, name, content, theme):
        pid = f"p{len(self.projects)}_{int(datetime.now().timestamp())}"
        self.projects[pid] = {
            'id': pid,
            'name': name,
            'content': content,
            'preview_html': '',  # Will be populated when preview is generated
            'theme': theme,
            'created': datetime.now().isoformat()
        }
        self.save()
        return pid
    
    def update(self, pid, **kwargs):
        if pid in self.projects:
            self.projects[pid].update(kwargs)
            self.projects[pid]['updated'] = datetime.now().isoformat()
            self.save()
            return True
        return False
    
    def get(self, pid):
        proj = self.projects.get(pid, {})
        proj['id'] = pid  # Ensure ID is included
        return proj
    
    def delete(self, pid):
        if pid in self.projects:
            del self.projects[pid]
            self.save()
            return True
        return False
    
    def list_projects(self):
        return [{'id': pid, **proj} for pid, proj in self.projects.items()]