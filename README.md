# AI Agent Visualizer 🤖✨

Visualize your AI agents as cute dot-characters right inside VS Code!

## 🌟 Features
- **Real-time Visualization**: See your AI agents wandering around a pixelated field.
- **Task Awareness**: Characters react and bounce when they receive new tasks.
- **Log Integration**: Connects to your `agents.log` file to reflect real activity.
- **Premium Aesthetics**: Smooth animations and a nostalgic pixel-art design.

## 🚀 Getting Started
1. Open the Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows).
2. Run the command **"AI Agent: Show Visualizer"**.
3. Watch your workspace come to life!

## 🔗 How to Connect Your Agents
This extension watches for a file named `agents.log` in your workspace root. Simply have your AI agents append their status in the following format:

```text
AGENT_0: Refactoring complex logic...
AGENT_1: Running unit tests...
```

The corresponding character will immediately show a speech bubble and start working!

## 🛠️ Requirements
- VS Code 1.75.0 or higher.

## 📄 License
This project is licensed under the MIT License.
