# Tabby Auto Encoding Detection Plugin

Automatic encoding detection for SSH/Telnet sessions, supporting Chinese and other multi-language environments.

## Features

- 🔍 **Automatic encoding detection** - Real-time detection of terminal output encoding
- 🌍 **Multi-language support** - UTF-8, GBK, GB2312, Big5, Shift_JIS, and more
- ⚙️ **Intelligent configuration** - Customizable detection parameters and priorities
- 📊 **Detection logging** - Optional logging of detection results for debugging

## Configuration

Configure in Tabby settings under the "Encoding Detection" tab:

- **Enable auto encoding detection** - Toggle the feature on/off
- **Confidence threshold** - Minimum confidence for detection (0.1-1.0)
- **Sample size** - Number of bytes used for each detection
- **Auto switch encoding** - Automatically switch when encoding is detected
- **Log detection results** - Output detection logs to console
- **Preferred encodings** - Priority order for encoding detection
- **Fallback encoding** - Default encoding when detection fails

## Supported Encodings

- UTF-8, UTF-16
- GBK, GB2312, GB18030 (Chinese)
- Big5 (Traditional Chinese)
- Shift_JIS, EUC-JP (Japanese)
- EUC-KR (Korean)
- ISO-8859-1, Windows-1252

## License

MIT License
