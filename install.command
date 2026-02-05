#!/bin/bash
# Jenna Installer - Run this once to set up Jenna on your Mac

echo "Installing Jenna..."

# Create app directory
mkdir -p ~/Applications/Jenna

# Copy files
cp -r "$(dirname "$0")"/* ~/Applications/Jenna/

# Remove quarantine
xattr -cr ~/Applications/Jenna

# Make executable
chmod +x ~/Applications/Jenna/jenna.py
chmod +x ~/Applications/Jenna/Jenna.command

# Create alias command
echo 'alias jenna="python3 ~/Applications/Jenna/jenna.py"' >> ~/.zshrc

echo ""
echo "✅ Jenna installed!"
echo ""
echo "To run Jenna, you can either:"
echo "  1. Double-click ~/Applications/Jenna/Jenna.command"
echo "  2. Open a new Terminal and type: jenna"
echo ""
echo "Starting Jenna now..."
echo ""

python3 ~/Applications/Jenna/jenna.py
