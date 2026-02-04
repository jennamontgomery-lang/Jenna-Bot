"""
Jenna Plugins System

Create your own plugins by adding Python files to this directory.
Each plugin should have a 'register' function that returns a dict of commands.

Example plugin (my_plugin.py):
```python
def say_hello(args):
    print(f"Hello, {args or 'friend'}!")

def register():
    return {
        "greet": say_hello,  # Command name: function
    }
```
"""
