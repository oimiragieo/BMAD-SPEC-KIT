# BMAD Method - VS Code Instructions

## Activating Agents

BMAD agents can be used in VS Code through GitHub Copilot Chat.

### Prerequisites

- **GitHub Copilot** subscription and extension installed
- VS Code with Copilot Chat enabled

### Setup

BMAD agents are installed as chat modes in `.github/chatmodes/` during installation.

### How to Use

1. **Open Copilot Chat**:
   - Click the Copilot icon in VS Code sidebar, OR
   - Use keyboard shortcut (Ctrl+Shift+I / Cmd+Shift+I)
2. **Select Mode**: Click the mode selector at the top of the chat panel
3. **Choose Agent**: Select your desired BMAD agent from the dropdown
4. **Start Chatting**: The agent is now active for this session

### Agent Menu

After activating an agent, you'll see a menu of available workflows. You can:

- **Select by number**: Choose from the numbered menu options
- **Use shortcuts**: Type `*workflow-name` (e.g., `*workflow-init`)
- **Natural language**: Simply say "Run workflow-init" or "Let's create a PRD"

### Examples

```
User: *workflow-init
Agent: [Runs workflow-init process]

User: Run the PRD workflow
Agent: [Activates PRD creation workflow]
```

### Important Notes

- **Fresh Chats**: Start a new chat session for each workflow to avoid context limitations
- **Mode Persistence**: The agent mode persists for the entire chat session
- **Switch Modes**: You can switch agents anytime via the mode selector dropdown
- **Settings**: Additional configuration available in `.vscode/settings.json`

### VS Code Settings

The installer configures settings in `.vscode/settings.json` including:

- Max requests per session
- Auto-fix preferences
- MCP discovery settings

### Troubleshooting

**Agents don't appear in mode selector:**

1. Ensure installation completed successfully
2. Check that `.github/chatmodes/` directory exists
3. Restart VS Code
4. Verify GitHub Copilot extension is active

**Workflows not loading:**

1. Ensure you've started a fresh chat session
2. Verify the agent loaded by checking the mode indicator
3. Try typing the full workflow path: `/bmad:bmm:workflows:workflow-init`

### Alternative: Use with Other Extensions

VS Code supports multiple AI assistants. Depending on which extension you have installed:

- **GitHub Copilot Chat**: Follow the instructions above
- **Cline**: See [Cline documentation](./cline.md)
- **Roo**: See [Roo documentation](./roo.md)
- **Continue**: Check for BMAD-specific integration

### See Also

- [GitHub Copilot-specific instructions](./github-copilot.md)
- [General BMM Quick Start Guide](../../src/modules/bmm/docs/quick-start.md)
- [IDE Integration Reference](../installers-bundlers/ide-injections.md)

---

**Note:** VS Code itself does not have built-in AI chat. BMAD agents require an AI extension like GitHub Copilot, Cline, or similar.
