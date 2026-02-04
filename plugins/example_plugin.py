"""
Example Plugin for Jenna

This demonstrates how to create custom plugins.
Rename this file and modify it to add your own commands!
"""

import random


def cmd_coinflip(args):
    """Flip a coin."""
    result = random.choice(["Heads", "Tails"])
    print(f"🪙 {result}!")


def cmd_dice(args):
    """Roll dice. Usage: dice [sides] [count]"""
    parts = args.split() if args else []
    sides = int(parts[0]) if len(parts) > 0 else 6
    count = int(parts[1]) if len(parts) > 1 else 1

    rolls = [random.randint(1, sides) for _ in range(count)]
    print(f"🎲 Rolling {count}d{sides}: {rolls}")
    if count > 1:
        print(f"   Total: {sum(rolls)}")


def cmd_choose(args):
    """Choose randomly from options. Usage: choose option1, option2, option3"""
    if not args:
        print("Usage: choose option1, option2, option3")
        return
    options = [o.strip() for o in args.split(",")]
    choice = random.choice(options)
    print(f"🎯 I choose: {choice}")


def cmd_magic8ball(args):
    """Ask the magic 8-ball a question."""
    responses = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful.",
    ]
    if not args:
        print("🎱 Ask me a yes/no question!")
        return
    print(f"🎱 {random.choice(responses)}")


def register():
    """Register plugin commands with Jenna."""
    return {
        "coinflip": cmd_coinflip,
        "flip": cmd_coinflip,
        "dice": cmd_dice,
        "roll": cmd_dice,
        "choose": cmd_choose,
        "pick": cmd_choose,
        "8ball": cmd_magic8ball,
        "magic8ball": cmd_magic8ball,
    }
