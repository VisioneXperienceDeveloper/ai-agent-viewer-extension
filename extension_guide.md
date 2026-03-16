# How to Run Your AI Agent Visualizer Extension

I have scaffolded a full VS Code extension project for you in the `ai-agent-extension` directory. It includes a "dot-pixel" style visualizer using the Webview API.

## Project Structure
- `package.json`: Manifest file defining the `AI Agent: Show Visualizer` command.
- `src/extension.ts`: Main logic that spawns the Webview panel.
- `media/`: Contains the UI assets (`style.css`, `main.js`) for the visualizer.

## Steps to "Enroll" and Run
1. **Open the Project**: Open the `ai-agent-extension` folder in VS Code.
2. **Start Debugging**:
   - Press **`F5`** on your keyboard.
   - This opens the **Extension Development Host**.
3. **Launch the Visualizer**:
   - In the new window, press `Cmd+Shift+P`.
   - Type **`AI Agent: Show Visualizer`** and press Enter.

## Real Log Integration (File Watcher)
The extension is now watching a file named **`agents.log`** in your workspace root. You can command the characters by writing to this file!

### How to Trigger Animations
Open a terminal and run these commands to see the characters react:

```bash
# Let AGENT_0 work
echo "AGENT_0: Refactoring complex logic..." >> agents.log

# Let AGENT_1 work
echo "AGENT_1: Running unit tests..." >> agents.log

# Let AGENT_2 work
echo "AGENT_2: Deploying to production..." >> agents.log
```

The characters will:
1. Show the text in a speech bubble.
2. Start a "bouncing" animation to indicate they are working.
3. Return to "Idle" status after 3 seconds.

## Customizing the Look
- To change the agent appearance, edit `media/style.css` (the `.agent::before` content).
- To change the behaviors, edit `media/main.js`.

> [!TIP]
> Since I already ran `npm install` and `npm run compile` for you, the `out/` folder is ready. You just need to press `F5`!
