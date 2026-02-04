# Jenna - Your Personal Desktop Bot Assistant

A customizable command-line assistant that can do whatever you want! Built with Python, no external dependencies required.

## Quick Start

```bash
# Run the bot
python3 jenna.py

# Or make it executable
chmod +x jenna.py
./jenna.py
```

## Features

### Core Commands
| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `hi/hello/hey` | Greet Jenna |
| `time` | Get current time |
| `date` | Get current date |
| `quit/exit/bye` | Exit the assistant |
| `clear` | Clear the screen |

### Notes & Reminders
| Command | Description |
|---------|-------------|
| `note <text>` | Save a quick note |
| `notes` | View all your notes |
| `clearnotes` | Delete all notes |
| `remind <mins> <message>` | Set a reminder |
| `reminders` | View pending reminders |
| `clearreminders` | Delete all reminders |

### System & Files
| Command | Description |
|---------|-------------|
| `run <command>` | Execute a shell command |
| `open <file/url>` | Open a file or URL |
| `ls [path]` | List directory contents |
| `pwd` | Print working directory |
| `cd <path>` | Change directory |
| `cat <file>` | Display file contents |
| `find <pattern>` | Find files matching pattern |

### Utilities
| Command | Description |
|---------|-------------|
| `search <query>` | Search the web (opens browser) |
| `calc <expression>` | Calculate math (e.g., `calc 2+2*3`) |
| `weather [city]` | Get weather info |

### Fun Commands
| Command | Description |
|---------|-------------|
| `joke` | Tell a programming joke |
| `fact` | Share a random fun fact |
| `motivate` | Get a motivational quote |
| `coinflip` | Flip a coin |
| `dice [sides] [count]` | Roll dice |
| `choose a, b, c` | Pick randomly from options |
| `8ball <question>` | Ask the magic 8-ball |

## Data Storage

Jenna stores your data in `~/.jenna/`:
- `notes.json` - Your saved notes
- `reminders.json` - Pending reminders
- `history.json` - Command history

## Creating Your Own Plugins

Extend Jenna by adding Python files to the `plugins/` directory!

### Example Plugin

Create `plugins/my_plugin.py`:

```python
def cmd_greet_user(args):
    """Custom greeting command."""
    name = args if args else "friend"
    print(f"Hello, {name}! Welcome!")

def cmd_countdown(args):
    """Count down from a number."""
    import time
    try:
        n = int(args) if args else 5
        for i in range(n, 0, -1):
            print(f"{i}...")
            time.sleep(1)
        print("Blast off!")
    except ValueError:
        print("Please provide a number.")

def register():
    """Register commands with Jenna."""
    return {
        "greetme": cmd_greet_user,
        "countdown": cmd_countdown,
    }
```

Now you can use `greetme` and `countdown` as commands!

## Examples

```
Jenna> note Buy groceries tomorrow
📝 Note saved! You have 1 note(s).

Jenna> remind 30 Take a break
⏰ Reminder set for 3:30 PM!

Jenna> calc 15 * 4 + 10
🔢 15 * 4 + 10 = 70

Jenna> weather London
🌤️  London: ⛅ +12°C

Jenna> dice 20 3
🎲 Rolling 3d20: [15, 7, 19]
   Total: 41

Jenna> run ls -la
(executes the command and shows output)
```

## Tips

- Jenna checks for due reminders each time you enter a command
- Use `history` to see your recent commands
- Natural language works for some queries: "what time is it?"
- Tab completion works in most terminals

## License

MIT License - Do whatever you want with it!

---

Made with Python. No AI required to run (it's all local code)!
