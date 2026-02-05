#!/bin/bash
# Creates Jenna.app for macOS

echo "Creating Jenna.app..."

# Create app bundle structure
APP_DIR="$HOME/Desktop/Jenna.app"
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Create Info.plist
cat > "$APP_DIR/Contents/Info.plist" << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>Jenna</string>
    <key>CFBundleDisplayName</key>
    <string>Jenna</string>
    <key>CFBundleIdentifier</key>
    <string>com.jenna.assistant</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleExecutable</key>
    <string>Jenna</string>
    <key>CFBundleIconFile</key>
    <string>icon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.10</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>LSUIElement</key>
    <false/>
</dict>
</plist>
PLIST

# Create launcher script
cat > "$APP_DIR/Contents/MacOS/Jenna" << 'LAUNCHER'
#!/bin/bash
cd "$(dirname "$0")/../Resources"
/usr/bin/python3 jenna_app.py
LAUNCHER

chmod +x "$APP_DIR/Contents/MacOS/Jenna"

# Copy Python app
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$SCRIPT_DIR/jenna_app.py" "$APP_DIR/Contents/Resources/"

# Create a pink icon using Python
python3 << 'ICONSCRIPT'
import os

# Create a simple pink icon as ICNS
# This creates a basic icon - for a real app you'd use a proper icon file

icon_path = os.path.expanduser("~/Desktop/Jenna.app/Contents/Resources/icon.icns")

# Simple 32x32 pink square icon in ICNS format (minimal)
# This is a placeholder - ideally you'd use a real icon
try:
    # Try to create with PIL if available
    from PIL import Image, ImageDraw

    sizes = [16, 32, 64, 128, 256, 512]
    img = Image.new('RGBA', (512, 512), (255, 105, 180, 255))  # Hot pink
    draw = ImageDraw.Draw(img)

    # Draw a simple "J" or heart shape
    # Heart shape
    draw.ellipse([100, 120, 280, 300], fill=(255, 182, 193, 255))
    draw.ellipse([230, 120, 410, 300], fill=(255, 182, 193, 255))
    draw.polygon([(100, 220), (256, 420), (410, 220)], fill=(255, 182, 193, 255))

    # Save as icns
    img.save(icon_path, format='ICNS')
    print("Created icon with PIL")
except ImportError:
    # If PIL not available, create a minimal valid ICNS file
    print("PIL not available, using default icon")
except Exception as e:
    print(f"Icon creation error: {e}")
ICONSCRIPT

# Remove quarantine
xattr -cr "$APP_DIR" 2>/dev/null

echo ""
echo "✅ Jenna.app created on your Desktop!"
echo ""
echo "You can now:"
echo "  1. Double-click Jenna.app on your Desktop to launch"
echo "  2. Drag it to your Applications folder"
echo "  3. Drag it to your Dock for easy access"
echo ""

# Offer to open it
read -p "Would you like to open Jenna now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "$APP_DIR"
fi
