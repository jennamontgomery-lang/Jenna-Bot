#!/usr/bin/env python3
"""
Jenna - Your Personal Desktop Assistant
A beautiful pink-themed GUI assistant app
"""

import os
import sys
import json
import subprocess
import datetime
import random
import webbrowser
import threading
import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
from pathlib import Path

# Configuration
CONFIG_DIR = Path.home() / ".jenna"
NOTES_FILE = CONFIG_DIR / "notes.json"
REMINDERS_FILE = CONFIG_DIR / "reminders.json"
HISTORY_FILE = CONFIG_DIR / "history.json"
CONFIG_DIR.mkdir(exist_ok=True)

# Pink Theme Colors
COLORS = {
    "bg": "#FFF0F5",           # Lavender blush
    "bg_dark": "#FFB6C1",      # Light pink
    "accent": "#FF69B4",       # Hot pink
    "accent_dark": "#DB7093",  # Pale violet red
    "text": "#4A4A4A",         # Dark gray
    "text_light": "#FFFFFF",   # White
    "input_bg": "#FFFFFF",     # White
    "chat_user": "#FCE4EC",    # Light pink
    "chat_bot": "#F8BBD9",     # Pink
}


class JennaApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Jenna - Your Personal Assistant")
        self.root.geometry("500x700")
        self.root.configure(bg=COLORS["bg"])

        # Make window resizable
        self.root.minsize(400, 500)

        # Load data
        self.notes = self._load_json(NOTES_FILE, [])
        self.reminders = self._load_json(REMINDERS_FILE, [])
        self.history = self._load_json(HISTORY_FILE, [])

        # Setup UI
        self._setup_ui()

        # Show welcome message
        self._add_bot_message("Hey there! I'm Jenna, your personal assistant. How can I help you today?\n\nType 'help' to see what I can do!")

        # Start reminder checker
        self._check_reminders()

    def _load_json(self, filepath, default):
        if filepath.exists():
            try:
                with open(filepath) as f:
                    return json.load(f)
            except:
                return default
        return default

    def _save_json(self, filepath, data):
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def _setup_ui(self):
        # Header
        header = tk.Frame(self.root, bg=COLORS["accent"], height=60)
        header.pack(fill="x")
        header.pack_propagate(False)

        title = tk.Label(
            header,
            text="Jenna",
            font=("Helvetica Neue", 24, "bold"),
            bg=COLORS["accent"],
            fg=COLORS["text_light"]
        )
        title.pack(pady=12)

        subtitle = tk.Label(
            header,
            text="Your Personal Assistant",
            font=("Helvetica Neue", 10),
            bg=COLORS["accent"],
            fg=COLORS["text_light"]
        )
        subtitle.place(relx=0.5, y=45, anchor="center")

        # Chat area
        chat_frame = tk.Frame(self.root, bg=COLORS["bg"])
        chat_frame.pack(fill="both", expand=True, padx=15, pady=10)

        self.chat_area = scrolledtext.ScrolledText(
            chat_frame,
            wrap=tk.WORD,
            font=("Helvetica Neue", 13),
            bg=COLORS["bg"],
            fg=COLORS["text"],
            relief="flat",
            padx=10,
            pady=10,
            state="disabled"
        )
        self.chat_area.pack(fill="both", expand=True)

        # Configure tags for styling
        self.chat_area.tag_configure("user", background=COLORS["chat_user"], spacing1=5, spacing3=5)
        self.chat_area.tag_configure("bot", background=COLORS["chat_bot"], spacing1=5, spacing3=5)
        self.chat_area.tag_configure("user_label", foreground=COLORS["accent_dark"], font=("Helvetica Neue", 10, "bold"))
        self.chat_area.tag_configure("bot_label", foreground=COLORS["accent"], font=("Helvetica Neue", 10, "bold"))

        # Quick actions
        actions_frame = tk.Frame(self.root, bg=COLORS["bg"])
        actions_frame.pack(fill="x", padx=15, pady=(0, 10))

        quick_actions = [
            ("Time", lambda: self._send_command("time")),
            ("Weather", lambda: self._send_command("weather")),
            ("Joke", lambda: self._send_command("joke")),
            ("Notes", lambda: self._send_command("notes")),
        ]

        for text, cmd in quick_actions:
            btn = tk.Button(
                actions_frame,
                text=text,
                font=("Helvetica Neue", 11),
                bg=COLORS["bg_dark"],
                fg=COLORS["text"],
                activebackground=COLORS["accent"],
                activeforeground=COLORS["text_light"],
                relief="flat",
                padx=15,
                pady=5,
                cursor="hand2",
                command=cmd
            )
            btn.pack(side="left", padx=3)

        # Input area
        input_frame = tk.Frame(self.root, bg=COLORS["accent"], height=60)
        input_frame.pack(fill="x", side="bottom")
        input_frame.pack_propagate(False)

        input_container = tk.Frame(input_frame, bg=COLORS["accent"])
        input_container.pack(fill="both", expand=True, padx=10, pady=10)

        self.input_field = tk.Entry(
            input_container,
            font=("Helvetica Neue", 14),
            bg=COLORS["input_bg"],
            fg=COLORS["text"],
            relief="flat",
            insertbackground=COLORS["accent"]
        )
        self.input_field.pack(side="left", fill="both", expand=True, ipady=8, padx=(0, 10))
        self.input_field.bind("<Return>", self._on_enter)
        self.input_field.focus()

        send_btn = tk.Button(
            input_container,
            text="Send",
            font=("Helvetica Neue", 12, "bold"),
            bg=COLORS["accent_dark"],
            fg=COLORS["text_light"],
            activebackground=COLORS["bg_dark"],
            relief="flat",
            padx=20,
            cursor="hand2",
            command=self._on_send
        )
        send_btn.pack(side="right")

    def _add_bot_message(self, message):
        self.chat_area.configure(state="normal")
        self.chat_area.insert("end", "Jenna\n", "bot_label")
        self.chat_area.insert("end", f"{message}\n\n", "bot")
        self.chat_area.configure(state="disabled")
        self.chat_area.see("end")

    def _add_user_message(self, message):
        self.chat_area.configure(state="normal")
        self.chat_area.insert("end", "You\n", "user_label")
        self.chat_area.insert("end", f"{message}\n\n", "user")
        self.chat_area.configure(state="disabled")
        self.chat_area.see("end")

    def _on_enter(self, event):
        self._on_send()

    def _on_send(self):
        message = self.input_field.get().strip()
        if not message:
            return

        self.input_field.delete(0, "end")
        self._add_user_message(message)
        self._process_command(message)

    def _send_command(self, cmd):
        self._add_user_message(cmd)
        self._process_command(cmd)

    def _process_command(self, message):
        # Add to history
        self.history.append({"message": message, "time": datetime.datetime.now().isoformat()})
        self._save_json(HISTORY_FILE, self.history[-100:])  # Keep last 100

        # Parse command
        parts = message.split(maxsplit=1)
        cmd = parts[0].lower()
        args = parts[1] if len(parts) > 1 else ""

        # Process commands
        response = self._handle_command(cmd, args, message)
        self._add_bot_message(response)

    def _handle_command(self, cmd, args, full_message):
        commands = {
            "help": self._cmd_help,
            "hi": self._cmd_greet,
            "hello": self._cmd_greet,
            "hey": self._cmd_greet,
            "time": self._cmd_time,
            "date": self._cmd_date,
            "note": self._cmd_note,
            "notes": self._cmd_notes,
            "clearnotes": self._cmd_clear_notes,
            "remind": self._cmd_remind,
            "reminders": self._cmd_reminders,
            "open": self._cmd_open,
            "search": self._cmd_search,
            "google": self._cmd_search,
            "calc": self._cmd_calc,
            "weather": self._cmd_weather,
            "joke": self._cmd_joke,
            "fact": self._cmd_fact,
            "motivate": self._cmd_motivate,
            "quote": self._cmd_motivate,
            "flip": self._cmd_coinflip,
            "coinflip": self._cmd_coinflip,
            "dice": self._cmd_dice,
            "roll": self._cmd_dice,
            "8ball": self._cmd_8ball,
            "choose": self._cmd_choose,
            "pick": self._cmd_choose,
            "timer": self._cmd_timer,
            "screenshot": self._cmd_screenshot,
            "say": self._cmd_say,
            "clear": self._cmd_clear,
        }

        if cmd in commands:
            return commands[cmd](args)
        else:
            return self._cmd_unknown(full_message)

    def _cmd_help(self, args):
        return """Here's what I can do:

**Chat & Fun**
• hi / hello / hey - Say hello!
• joke - Tell a funny joke
• fact - Share a fun fact
• motivate / quote - Inspirational quote
• coinflip / flip - Flip a coin
• dice / roll [sides] - Roll dice
• 8ball [question] - Magic 8-ball
• choose [a, b, c] - Pick randomly

**Productivity**
• time - Current time
• date - Today's date
• note [text] - Save a note
• notes - View your notes
• remind [mins] [message] - Set reminder
• reminders - View reminders
• timer [seconds] - Set a timer
• calc [expression] - Calculator

**Actions**
• open [url/app] - Open website or app
• search / google [query] - Search Google
• weather [city] - Get weather
• screenshot - Take a screenshot
• say [text] - Text to speech

• clear - Clear chat"""

    def _cmd_greet(self, args):
        greetings = [
            "Hey there! What can I do for you?",
            "Hello! I'm here to help!",
            "Hi! What's on your mind?",
            "Hey! Ready to assist you!",
            "Hello, friend! How can I help today?",
        ]
        return random.choice(greetings)

    def _cmd_time(self, args):
        now = datetime.datetime.now()
        return f"It's {now.strftime('%I:%M %p')} right now."

    def _cmd_date(self, args):
        now = datetime.datetime.now()
        return f"Today is {now.strftime('%A, %B %d, %Y')}."

    def _cmd_note(self, args):
        if not args:
            return "What would you like me to note down? Try: note [your text]"
        self.notes.append({
            "text": args,
            "created": datetime.datetime.now().isoformat()
        })
        self._save_json(NOTES_FILE, self.notes)
        return f"Got it! I've saved your note. You have {len(self.notes)} note(s) total."

    def _cmd_notes(self, args):
        if not self.notes:
            return "You don't have any notes yet. Try: note [your text]"
        result = f"Your Notes ({len(self.notes)}):\n\n"
        for i, note in enumerate(self.notes[-10:], 1):  # Show last 10
            created = datetime.datetime.fromisoformat(note["created"])
            result += f"{i}. {note['text']}\n   ({created.strftime('%b %d, %I:%M %p')})\n"
        return result

    def _cmd_clear_notes(self, args):
        self.notes = []
        self._save_json(NOTES_FILE, self.notes)
        return "All notes cleared!"

    def _cmd_remind(self, args):
        if not args:
            return "Set a reminder like: remind 10 Take a break"
        parts = args.split(maxsplit=1)
        if len(parts) < 2:
            return "Please specify time and message: remind [minutes] [message]"
        try:
            minutes = int(parts[0])
            message = parts[1]
        except ValueError:
            return "Please use a number for minutes: remind 10 Take a break"

        remind_time = datetime.datetime.now() + datetime.timedelta(minutes=minutes)
        self.reminders.append({
            "message": message,
            "time": remind_time.isoformat()
        })
        self._save_json(REMINDERS_FILE, self.reminders)
        return f"I'll remind you to '{message}' at {remind_time.strftime('%I:%M %p')}!"

    def _cmd_reminders(self, args):
        if not self.reminders:
            return "No pending reminders. Set one with: remind [minutes] [message]"
        result = f"Pending Reminders ({len(self.reminders)}):\n\n"
        for i, r in enumerate(self.reminders, 1):
            remind_time = datetime.datetime.fromisoformat(r["time"])
            result += f"{i}. {r['message']}\n   (Due: {remind_time.strftime('%b %d, %I:%M %p')})\n"
        return result

    def _cmd_open(self, args):
        if not args:
            return "What should I open? Try: open google.com"
        target = args
        if not target.startswith(("http://", "https://", "/")):
            # Check if it's an app name
            app_path = f"/Applications/{target}.app"
            if os.path.exists(app_path):
                subprocess.run(["open", app_path])
                return f"Opening {target}..."
            # Otherwise treat as URL
            target = "https://" + target
        webbrowser.open(target)
        return f"Opening {args}..."

    def _cmd_search(self, args):
        if not args:
            return "What would you like me to search? Try: search cute cats"
        query = args.replace(" ", "+")
        webbrowser.open(f"https://www.google.com/search?q={query}")
        return f"Searching Google for '{args}'..."

    def _cmd_calc(self, args):
        if not args:
            return "What should I calculate? Try: calc 15 * 4 + 10"
        try:
            allowed = set("0123456789+-*/(). ")
            if not all(c in allowed for c in args):
                return "I can only do math with numbers and +, -, *, /, (, )"
            result = eval(args)
            return f"{args} = **{result}**"
        except:
            return "I couldn't calculate that. Try something like: calc 2 + 2"

    def _cmd_weather(self, args):
        city = args if args else ""
        try:
            result = subprocess.run(
                ["curl", "-s", f"wttr.in/{city}?format=3"],
                capture_output=True, text=True, timeout=10
            )
            if result.stdout:
                return result.stdout.strip()
            return "Couldn't get weather. Try: weather London"
        except:
            return "Weather service unavailable right now."

    def _cmd_joke(self, args):
        jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "Why did the developer go broke? Because he used up all his cache!",
            "There are only 10 types of people: those who understand binary and those who don't.",
            "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
            "Why do Java developers wear glasses? Because they can't C#!",
            "What's a programmer's favorite hangout place? Foo Bar!",
            "Why was the JavaScript developer sad? He didn't Node how to Express himself!",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
            "Why did the programmer quit? He didn't get arrays!",
            "What do you call a computer that sings? A-Dell!",
            "Why was the computer cold? It left its Windows open!",
            "What's a computer's least favorite food? Spam!",
        ]
        return random.choice(jokes)

    def _cmd_fact(self, args):
        facts = [
            "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible!",
            "A day on Venus is longer than a year on Venus.",
            "Octopuses have three hearts and blue blood!",
            "The shortest war in history lasted 38-45 minutes (Britain vs Zanzibar, 1896).",
            "Bananas are berries, but strawberries aren't!",
            "A group of flamingos is called a 'flamboyance'.",
            "The first computer programmer was Ada Lovelace in the 1840s.",
            "There are more possible chess games than atoms in the observable universe.",
            "Cows have best friends and get stressed when separated.",
            "The inventor of the Pringles can is buried in one.",
            "A jiffy is an actual unit of time: 1/100th of a second.",
            "The shortest complete sentence in English is 'I am.'",
        ]
        return f"Fun fact: {random.choice(facts)}"

    def _cmd_motivate(self, args):
        quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It does not matter how slowly you go as long as you do not stop. - Confucius",
            "Everything you've ever wanted is on the other side of fear. - George Addair",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The best time to plant a tree was 20 years ago. The second best time is now.",
            "Your limitation—it's only your imagination.",
            "Dream it. Wish it. Do it.",
            "Great things never come from comfort zones.",
        ]
        return random.choice(quotes)

    def _cmd_coinflip(self, args):
        result = random.choice(["Heads", "Tails"])
        return f"*flips coin*\n\nIt's **{result}**!"

    def _cmd_dice(self, args):
        sides = 6
        count = 1
        if args:
            parts = args.split()
            try:
                sides = int(parts[0]) if len(parts) > 0 else 6
                count = int(parts[1]) if len(parts) > 1 else 1
            except ValueError:
                pass

        rolls = [random.randint(1, sides) for _ in range(count)]
        result = f"*rolls {count}d{sides}*\n\n"
        result += f"**{rolls}**"
        if count > 1:
            result += f"\nTotal: **{sum(rolls)}**"
        return result

    def _cmd_8ball(self, args):
        if not args:
            return "Ask me a yes/no question! Try: 8ball Will I have a good day?"
        responses = [
            "It is certain.", "It is decidedly so.", "Without a doubt.",
            "Yes, definitely.", "You may rely on it.", "As I see it, yes.",
            "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
            "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
            "Cannot predict now.", "Concentrate and ask again.",
            "Don't count on it.", "My reply is no.", "My sources say no.",
            "Outlook not so good.", "Very doubtful.",
        ]
        return f"*shakes magic 8-ball*\n\n**{random.choice(responses)}**"

    def _cmd_choose(self, args):
        if not args:
            return "Give me options to choose from! Try: choose pizza, tacos, sushi"
        options = [o.strip() for o in args.split(",")]
        if len(options) < 2:
            options = args.split()
        if len(options) < 2:
            return "Give me at least 2 options separated by commas!"
        choice = random.choice(options)
        return f"*thinking...*\n\nI choose: **{choice}**!"

    def _cmd_timer(self, args):
        if not args:
            return "Set a timer like: timer 30 (for 30 seconds)"
        try:
            seconds = int(args)
        except ValueError:
            return "Please use a number of seconds: timer 30"

        def timer_done():
            self.root.after(0, lambda: messagebox.showinfo("Timer", f"Your {seconds} second timer is done!"))
            self.root.after(0, lambda: self._add_bot_message(f"Your {seconds} second timer is done!"))

        threading.Timer(seconds, timer_done).start()
        return f"Timer set for {seconds} seconds!"

    def _cmd_screenshot(self, args):
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"~/Desktop/screenshot_{timestamp}.png"
        subprocess.run(["screencapture", "-i", os.path.expanduser(filename)])
        return f"Screenshot saved to Desktop!"

    def _cmd_say(self, args):
        if not args:
            return "What should I say? Try: say Hello there!"
        subprocess.Popen(["say", args])
        return f"*Speaking:* {args}"

    def _cmd_clear(self, args):
        self.chat_area.configure(state="normal")
        self.chat_area.delete(1.0, "end")
        self.chat_area.configure(state="disabled")
        return "Chat cleared! How can I help you?"

    def _cmd_unknown(self, message):
        lower = message.lower()

        # Try to understand natural language
        if any(w in lower for w in ["what time", "what's the time"]):
            return self._cmd_time("")
        elif any(w in lower for w in ["what date", "what day", "what's the date"]):
            return self._cmd_date("")
        elif any(w in lower for w in ["thank", "thanks"]):
            return random.choice(["You're welcome!", "Happy to help!", "Anytime!", "No problem!"])
        elif any(w in lower for w in ["how are you", "how're you"]):
            return "I'm doing great, thanks for asking! How can I help you?"
        elif "your name" in lower:
            return "I'm Jenna, your personal assistant!"
        elif any(w in lower for w in ["love you", "like you"]):
            return "Aww, that's so sweet! I'm here for you!"
        elif any(w in lower for w in ["bye", "goodbye", "see you"]):
            return "Goodbye! Have an amazing day!"
        else:
            return f"I'm not sure what you mean. Type 'help' to see what I can do!"

    def _check_reminders(self):
        now = datetime.datetime.now()
        due = []
        remaining = []

        for r in self.reminders:
            remind_time = datetime.datetime.fromisoformat(r["time"])
            if remind_time <= now:
                due.append(r)
            else:
                remaining.append(r)

        if due:
            self.reminders = remaining
            self._save_json(REMINDERS_FILE, self.reminders)
            for r in due:
                self._add_bot_message(f"**Reminder:** {r['message']}")
                messagebox.showinfo("Reminder", r["message"])

        # Check again in 30 seconds
        self.root.after(30000, self._check_reminders)

    def run(self):
        self.root.mainloop()


def main():
    app = JennaApp()
    app.run()


if __name__ == "__main__":
    main()
