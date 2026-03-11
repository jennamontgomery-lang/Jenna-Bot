#!/usr/bin/env python3
"""
Jenna - Your Personal Desktop Bot Assistant
A customizable assistant that can do whatever you want!
"""

import os
import sys
import json
import subprocess
import datetime
import random
import re
import importlib.util
from pathlib import Path

# Configuration
CONFIG_DIR = Path.home() / ".jenna"
NOTES_FILE = CONFIG_DIR / "notes.json"
REMINDERS_FILE = CONFIG_DIR / "reminders.json"
HISTORY_FILE = CONFIG_DIR / "history.json"

# Ensure config directory exists
CONFIG_DIR.mkdir(exist_ok=True)


class Jenna:
    """Your personal bot assistant."""

    def __init__(self):
        self.name = "Jenna"
        self.running = True
        self.notes = self._load_json(NOTES_FILE, [])
        self.reminders = self._load_json(REMINDERS_FILE, [])
        self.history = self._load_json(HISTORY_FILE, [])
        self.commands = self._register_commands()

    def _load_json(self, filepath, default):
        """Load JSON data from file."""
        if filepath.exists():
            try:
                with open(filepath, "r") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                return default
        return default

    def _save_json(self, filepath, data):
        """Save JSON data to file."""
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def _load_plugins(self):
        """Load plugins from the plugins directory."""
        plugins_dir = Path(__file__).parent / "plugins"
        if not plugins_dir.exists():
            return {}

        plugin_commands = {}
        for plugin_file in plugins_dir.glob("*.py"):
            if plugin_file.name.startswith("_"):
                continue
            try:
                spec = importlib.util.spec_from_file_location(
                    plugin_file.stem, plugin_file
                )
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                if hasattr(module, "register"):
                    cmds = module.register()
                    plugin_commands.update(cmds)
                    print(f"  Loaded plugin: {plugin_file.stem}")
            except Exception as e:
                print(f"  Failed to load plugin {plugin_file.stem}: {e}")

        return plugin_commands

    def _register_commands(self):
        """Register all available commands."""
        # Load plugin commands first
        plugin_cmds = self._load_plugins()

        commands = {
            "help": self.cmd_help,
            "hi": self.cmd_greet,
            "hello": self.cmd_greet,
            "hey": self.cmd_greet,
            "time": self.cmd_time,
            "date": self.cmd_date,
            "note": self.cmd_note,
            "notes": self.cmd_list_notes,
            "remind": self.cmd_remind,
            "reminders": self.cmd_list_reminders,
            "run": self.cmd_run,
            "exec": self.cmd_run,
            "open": self.cmd_open,
            "search": self.cmd_search,
            "calc": self.cmd_calc,
            "weather": self.cmd_weather,
            "joke": self.cmd_joke,
            "fact": self.cmd_fact,
            "motivate": self.cmd_motivate,
            "ls": self.cmd_ls,
            "pwd": self.cmd_pwd,
            "cd": self.cmd_cd,
            "cat": self.cmd_cat,
            "find": self.cmd_find,
            "history": self.cmd_history,
            "clear": self.cmd_clear,
            "clearhistory": self.cmd_clear_history,
            "clearnotes": self.cmd_clear_notes,
            "clearreminders": self.cmd_clear_reminders,
            "quit": self.cmd_quit,
            "exit": self.cmd_quit,
            "bye": self.cmd_quit,
        }

        # Merge plugin commands (plugins can override built-ins)
        commands.update(plugin_cmds)
        return commands

    def greet(self):
        """Display welcome message."""
        hour = datetime.datetime.now().hour
        if hour < 12:
            greeting = "Good morning"
        elif hour < 17:
            greeting = "Good afternoon"
        else:
            greeting = "Good evening"

        print(f"\n{'='*50}")
        print(f"  {greeting}! I'm {self.name}, your personal assistant.")
        print(f"  Type 'help' to see what I can do!")
        print(f"{'='*50}\n")
        self._check_reminders()

    def _check_reminders(self):
        """Check for due reminders."""
        now = datetime.datetime.now()
        due_reminders = []
        remaining = []

        for r in self.reminders:
            reminder_time = datetime.datetime.fromisoformat(r["time"])
            if reminder_time <= now:
                due_reminders.append(r)
            else:
                remaining.append(r)

        if due_reminders:
            print("🔔 You have reminders!")
            for r in due_reminders:
                print(f"   → {r['message']}")
            print()
            self.reminders = remaining
            self._save_json(REMINDERS_FILE, self.reminders)

    # ==================== COMMANDS ====================

    def cmd_help(self, args):
        """Show available commands."""
        help_text = """
Available Commands:
-------------------
GENERAL:
  help              - Show this help message
  hi/hello/hey      - Greet me!
  time              - Get current time
  date              - Get current date
  quit/exit/bye     - Exit the assistant
  clear             - Clear the screen

NOTES & REMINDERS:
  note <text>       - Save a quick note
  notes             - View all your notes
  clearnotes        - Delete all notes
  remind <mins> <msg> - Set a reminder (e.g., remind 5 Take a break)
  reminders         - View pending reminders
  clearreminders    - Delete all reminders

SYSTEM & FILES:
  run <command>     - Execute a shell command
  open <file/url>   - Open a file or URL
  ls [path]         - List directory contents
  pwd               - Print working directory
  cd <path>         - Change directory
  cat <file>        - Display file contents
  find <pattern>    - Find files matching pattern

UTILITIES:
  search <query>    - Search the web (opens browser)
  calc <expression> - Calculate a math expression
  weather <city>    - Get weather info (requires curl)

SOCIAL MEDIA:
  report <X_URL>    - Analyze X (Twitter) post metrics (CTR, ER, Likes, Views, Comments, Reposts)
  report config     - View/configure API credentials

FUN:
  joke              - Tell me a joke!
  fact              - Random fun fact
  motivate          - Get motivated!

HISTORY:
  history           - View command history
  clearhistory      - Clear command history

PLUGINS (from plugins/ directory):
  coinflip/flip     - Flip a coin
  dice/roll [sides] [count] - Roll dice
  choose/pick <a, b, c> - Pick randomly from options
  8ball <question>  - Ask the magic 8-ball

TIP: Add your own commands in the plugins/ folder!
"""
        print(help_text)

    def cmd_greet(self, args):
        """Respond to greeting."""
        responses = [
            "Hey there! How can I help you today?",
            "Hello! What would you like me to do?",
            "Hi! Ready to assist you!",
            "Greetings! What's on your mind?",
            "Hey! I'm here to help!",
        ]
        print(random.choice(responses))

    def cmd_time(self, args):
        """Show current time."""
        now = datetime.datetime.now()
        print(f"🕐 Current time: {now.strftime('%I:%M:%S %p')}")

    def cmd_date(self, args):
        """Show current date."""
        now = datetime.datetime.now()
        print(f"📅 Today is {now.strftime('%A, %B %d, %Y')}")

    def cmd_note(self, args):
        """Save a note."""
        if not args:
            print("Usage: note <your note text>")
            return
        note = {
            "text": args,
            "created": datetime.datetime.now().isoformat(),
        }
        self.notes.append(note)
        self._save_json(NOTES_FILE, self.notes)
        print(f"📝 Note saved! You have {len(self.notes)} note(s).")

    def cmd_list_notes(self, args):
        """List all notes."""
        if not self.notes:
            print("📝 No notes yet. Use 'note <text>' to add one!")
            return
        print(f"\n📝 Your Notes ({len(self.notes)}):")
        print("-" * 40)
        for i, note in enumerate(self.notes, 1):
            created = datetime.datetime.fromisoformat(note["created"])
            print(f"{i}. {note['text']}")
            print(f"   ({created.strftime('%b %d, %Y %I:%M %p')})")
        print()

    def cmd_remind(self, args):
        """Set a reminder."""
        if not args:
            print("Usage: remind <minutes> <message>")
            print("Example: remind 10 Take a break")
            return
        parts = args.split(maxsplit=1)
        if len(parts) < 2:
            print("Please specify both time (in minutes) and message.")
            return
        try:
            minutes = int(parts[0])
            message = parts[1]
        except ValueError:
            print("Invalid time. Please use a number of minutes.")
            return

        remind_time = datetime.datetime.now() + datetime.timedelta(minutes=minutes)
        reminder = {
            "message": message,
            "time": remind_time.isoformat(),
        }
        self.reminders.append(reminder)
        self._save_json(REMINDERS_FILE, self.reminders)
        print(f"⏰ Reminder set for {remind_time.strftime('%I:%M %p')}!")

    def cmd_list_reminders(self, args):
        """List all reminders."""
        if not self.reminders:
            print("⏰ No pending reminders.")
            return
        print(f"\n⏰ Pending Reminders ({len(self.reminders)}):")
        print("-" * 40)
        for i, r in enumerate(self.reminders, 1):
            remind_time = datetime.datetime.fromisoformat(r["time"])
            print(f"{i}. {r['message']}")
            print(f"   (Due: {remind_time.strftime('%b %d, %Y %I:%M %p')})")
        print()

    def cmd_run(self, args):
        """Execute a shell command."""
        if not args:
            print("Usage: run <command>")
            return
        try:
            result = subprocess.run(
                args,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30,
            )
            if result.stdout:
                print(result.stdout)
            if result.stderr:
                print(f"Error: {result.stderr}")
        except subprocess.TimeoutExpired:
            print("Command timed out (30s limit).")
        except Exception as e:
            print(f"Error executing command: {e}")

    def cmd_open(self, args):
        """Open a file or URL."""
        if not args:
            print("Usage: open <file or URL>")
            return
        try:
            if sys.platform == "darwin":
                subprocess.run(["open", args])
            elif sys.platform == "win32":
                os.startfile(args)
            else:
                subprocess.run(["xdg-open", args])
            print(f"Opening: {args}")
        except Exception as e:
            print(f"Error opening: {e}")

    def cmd_search(self, args):
        """Search the web."""
        if not args:
            print("Usage: search <query>")
            return
        query = args.replace(" ", "+")
        url = f"https://www.google.com/search?q={query}"
        self.cmd_open(url)

    def cmd_calc(self, args):
        """Calculate a math expression."""
        if not args:
            print("Usage: calc <expression>")
            print("Example: calc 2 + 2 * 3")
            return
        try:
            # Only allow safe math operations
            allowed = set("0123456789+-*/(). ")
            if not all(c in allowed for c in args):
                print("Invalid characters in expression.")
                return
            result = eval(args)
            print(f"🔢 {args} = {result}")
        except Exception as e:
            print(f"Error calculating: {e}")

    def cmd_weather(self, args):
        """Get weather info using wttr.in."""
        city = args if args else ""
        try:
            result = subprocess.run(
                ["curl", "-s", f"wttr.in/{city}?format=3"],
                capture_output=True,
                text=True,
                timeout=10,
            )
            if result.stdout:
                print(f"🌤️  {result.stdout.strip()}")
            else:
                print("Couldn't fetch weather. Try specifying a city.")
        except Exception:
            print("Weather service unavailable.")

    def cmd_joke(self, args):
        """Tell a joke."""
        jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "Why did the developer go broke? Because he used up all his cache!",
            "There are only 10 types of people: those who understand binary and those who don't.",
            "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
            "Why do Java developers wear glasses? Because they can't C#!",
            "What's a programmer's favorite hangout place? Foo Bar!",
            "Why was the JavaScript developer sad? Because he didn't Node how to Express himself!",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
            "Why did the programmer quit his job? Because he didn't get arrays!",
            "What do you call 8 hobbits? A hobbyte!",
        ]
        print(f"😄 {random.choice(jokes)}")

    def cmd_fact(self, args):
        """Share a random fun fact."""
        facts = [
            "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!",
            "A day on Venus is longer than a year on Venus.",
            "Octopuses have three hearts and blue blood!",
            "The shortest war in history lasted 38-45 minutes (Britain vs Zanzibar, 1896).",
            "Bananas are berries, but strawberries aren't!",
            "A group of flamingos is called a 'flamboyance'.",
            "The first computer programmer was Ada Lovelace in the 1840s.",
            "The first computer bug was an actual bug - a moth found in Harvard's Mark II computer in 1947.",
            "There are more possible iterations of a game of chess than atoms in the observable universe.",
            "The average person walks about 100,000 miles in their lifetime - that's 4 times around the Earth!",
        ]
        print(f"💡 Fun fact: {random.choice(facts)}")

    def cmd_motivate(self, args):
        """Share a motivational quote."""
        quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Code is like humor. When you have to explain it, it's bad. - Cory House",
            "First, solve the problem. Then, write the code. - John Johnson",
            "The best time to plant a tree was 20 years ago. The second best time is now.",
            "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
            "Every expert was once a beginner.",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "Your limitation—it's only your imagination.",
            "Dream it. Wish it. Do it.",
        ]
        print(f"💪 {random.choice(quotes)}")

    def cmd_ls(self, args):
        """List directory contents."""
        path = args if args else "."
        try:
            entries = os.listdir(path)
            for entry in sorted(entries):
                full_path = os.path.join(path, entry)
                if os.path.isdir(full_path):
                    print(f"📁 {entry}/")
                else:
                    print(f"📄 {entry}")
        except Exception as e:
            print(f"Error: {e}")

    def cmd_pwd(self, args):
        """Print working directory."""
        print(f"📍 {os.getcwd()}")

    def cmd_cd(self, args):
        """Change directory."""
        if not args:
            args = str(Path.home())
        try:
            os.chdir(args)
            print(f"📍 Changed to: {os.getcwd()}")
        except Exception as e:
            print(f"Error: {e}")

    def cmd_cat(self, args):
        """Display file contents."""
        if not args:
            print("Usage: cat <filename>")
            return
        try:
            with open(args, "r") as f:
                print(f.read())
        except Exception as e:
            print(f"Error: {e}")

    def cmd_find(self, args):
        """Find files matching pattern."""
        if not args:
            print("Usage: find <pattern>")
            return
        import fnmatch

        matches = []
        for root, dirs, files in os.walk("."):
            for name in files + dirs:
                if fnmatch.fnmatch(name.lower(), args.lower()):
                    matches.append(os.path.join(root, name))

        if matches:
            print(f"Found {len(matches)} match(es):")
            for m in matches[:20]:  # Limit output
                print(f"  {m}")
            if len(matches) > 20:
                print(f"  ... and {len(matches) - 20} more")
        else:
            print("No matches found.")

    def cmd_history(self, args):
        """Show command history."""
        if not self.history:
            print("No command history yet.")
            return
        print("\n📜 Command History:")
        print("-" * 40)
        for i, cmd in enumerate(self.history[-20:], 1):
            print(f"{i}. {cmd}")
        print()

    def cmd_clear(self, args):
        """Clear the screen."""
        os.system("clear" if os.name != "nt" else "cls")

    def cmd_clear_history(self, args):
        """Clear command history."""
        self.history = []
        self._save_json(HISTORY_FILE, self.history)
        print("Command history cleared.")

    def cmd_clear_notes(self, args):
        """Clear all notes."""
        self.notes = []
        self._save_json(NOTES_FILE, self.notes)
        print("All notes cleared.")

    def cmd_clear_reminders(self, args):
        """Clear all reminders."""
        self.reminders = []
        self._save_json(REMINDERS_FILE, self.reminders)
        print("All reminders cleared.")

    def cmd_quit(self, args):
        """Exit the assistant."""
        goodbyes = [
            "Goodbye! Have a great day!",
            "See you later!",
            "Bye! Don't hesitate to come back!",
            "Take care! I'll be here when you need me!",
            "Until next time!",
        ]
        print(f"\n👋 {random.choice(goodbyes)}\n")
        self.running = False

    # ==================== MAIN LOOP ====================

    def process_input(self, user_input):
        """Process user input and execute commands."""
        user_input = user_input.strip()
        if not user_input:
            return

        # Add to history
        self.history.append(user_input)
        self._save_json(HISTORY_FILE, self.history)

        # Parse command and arguments
        parts = user_input.split(maxsplit=1)
        command = parts[0].lower()
        args = parts[1] if len(parts) > 1 else ""

        # Execute command
        if command in self.commands:
            self.commands[command](args)
        else:
            # Try to be helpful for unknown commands
            self._handle_unknown(user_input)

    def _handle_unknown(self, user_input):
        """Handle unknown input intelligently."""
        lower = user_input.lower()

        # Check for common patterns
        if any(q in lower for q in ["what time", "what's the time"]):
            self.cmd_time("")
        elif any(q in lower for q in ["what date", "what's the date", "what day"]):
            self.cmd_date("")
        elif "thank" in lower:
            print("You're welcome! Happy to help! 😊")
        elif any(w in lower for w in ["how are you", "how're you"]):
            print("I'm doing great, thanks for asking! How can I help you?")
        elif "your name" in lower:
            print(f"I'm {self.name}, your personal assistant!")
        else:
            print(f"I'm not sure what you mean by '{user_input}'.")
            print("Type 'help' to see available commands.")

    def run(self):
        """Main loop."""
        self.greet()

        while self.running:
            try:
                user_input = input(f"{self.name}> ").strip()
                self.process_input(user_input)
                # Check reminders periodically
                self._check_reminders()
            except KeyboardInterrupt:
                print()
                self.cmd_quit("")
            except EOFError:
                self.cmd_quit("")


def main():
    """Entry point."""
    bot = Jenna()
    bot.run()


if __name__ == "__main__":
    main()
