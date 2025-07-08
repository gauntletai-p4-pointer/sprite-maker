# Pointer Setup Instructions

## Environment Configuration

This application now loads the OpenAI API key from environment variables instead of user input.

### Setup Steps:

1. **Create a `.env.local` file** in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your OpenAI API key** to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

3. **Build the configuration**:
   ```bash
   npm run build:config
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

### Important Security Notes:

- ✅ The `.env.local` file is already in `.gitignore` - never commit it!
- ✅ The generated `js/config.js` file is also in `.gitignore`
- ✅ The API key input field is hidden from the UI
- ⚠️ Always use `.env.local` for local development only
- ⚠️ For production, use proper environment variable management

### Development Workflow:

The API key is automatically loaded when you run:
- `npm start` - Builds config and starts the server
- `npm run dev` - Builds config and starts development mode
- `npm run build` - Builds config and compiles assets

### Troubleshooting:

If you see "No API key found" errors:
1. Verify your `.env.local` file exists and has the correct format
2. Ensure your API key starts with `sk-`
3. Run `npm run build:config` to regenerate the config file
4. Check the console for any error messages 