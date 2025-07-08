# Pointer

<div align="center">
  <img src="./media/spriteforge.png" alt="Pointer Logo" width="300px" />
  <p><em>AI-powered game sprite generation using DALL-E 3 and GPT-Image-1</em></p>
</div>

## 🎯 Overview

Pointer is an AI-first web application that creates professional game sprites through intelligent chat interactions. Using a combination of OpenAI's DALL-E 3 for character generation and GPT-Image-1 for animations, Pointer provides a streamlined workflow from character description to animated sprite sheets.

## ✨ Features

### 🤖 **AI Chat-Driven Workflow**
- **Smart Routing**: AI automatically classifies your requests and routes them to appropriate generation systems
- **Step-Based Generation**: Character creation (DALL-E 3) → Animation creation (GPT-Image-1)
- **Natural Language Interface**: Describe characters and animations in plain English

### 🎨 **Dual AI Model Integration**
- **DALL-E 3**: High-quality character generation from text descriptions
- **GPT-Image-1**: Advanced sprite animation and style transformation
- **Automatic Model Selection**: System chooses the right AI model based on your current step

### 🎮 **Multiple Game Styles**
- **Stardew Valley** (32×32 pixel art)
- **Breath of the Wild** (256×256 cel-shaded)
- **Genshin Impact** (192×192 anime-styled)
- **Hollow Knight** (128×128 hand-drawn gothic)
- **Fall Guys** (160×160 bouncy cartoon)
- **8-bit Retro** (NES-style constraints)
- **Arcade Fighter** (CPS-2 sprite style)
- **Flat Cartoon** (modern indie game style)

### 🎬 **Animation Actions**
- **Idle** (4-frame breathing animation)
- **Walk** (12-frame walking cycle)
- **Jump** (4-frame jump sequence)
- **Air Attack** (2-frame aerial combat)
- **Hurt** (2-frame damage reaction)
- **Knockout** (6-frame defeat sequence)
- **Punches** (8-frame combat combinations)
- **Turn Around** (3-frame direction change)

### 💡 **Advanced Features**
- **Real-time Animation Preview**: Watch sprites animate as they're generated
- **Frame-by-Frame Editing**: Regenerate individual animation frames
- **Transparent Backgrounds**: Production-ready sprites with proper alpha channels
- **Batch Download**: Export complete animation sequences as ZIP files

## 🚀 Getting Started

### Prerequisites

- **Python 3.x** (for development server)
- **OpenAI API Keys**:
  - DALL-E 3 access for character generation
  - GPT-Image-1 access for animations

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd spritesheet-builder/spriteforge
   ```

2. **Set up your API keys**:
   Create a `.env.local` file in the spriteforge directory:
   ```bash
   DALL_E_3_API_KEY=your-dalle3-api-key-here
   GPT_IMAGE_1_API_KEY=your-gpt-image1-api-key-here
   ```

3. **Build the configuration**:
   ```bash
   npm run build:config
   ```

4. **Start the development server**:
   ```bash
   python3 -m http.server 8080
   ```

5. **Open your browser**:
   Navigate to `http://localhost:8080/spriteforge/`

## 🎮 How to Use

### Step 1: Character Generation
1. **Open the AI Assistant** (right sidebar)
2. **Describe your character** in natural language:
   - "A wise wizard with a purple robe and golden staff"
   - "A cyberpunk ninja with neon armor and glowing eyes"
   - "A medieval knight in shining armor with a blue cape"
3. **Watch the magic happen**: DALL-E 3 generates your character automatically
4. **Click "Continue to Actions →"** when satisfied

### Step 2: Animation Creation
1. **Choose an animation type** from the dropdown
2. **Generate frames**: GPT-Image-1 creates animation sequences
3. **Preview animations**: Real-time playback in the preview area
4. **Edit frames**: Click any frame to regenerate with custom prompts
5. **Download**: Export your completed sprite sheets

### AI Chat Commands
The AI Assistant understands natural language requests:
- **"Create a wizard character"** → Character generation
- **"Make a walking animation"** → Walking cycle generation
- **"Generate a jump sequence"** → Jump animation
- **"Help me with sprite creation"** → General assistance

## 🛠️ Technical Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6 modules)
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: 
  - OpenAI DALL-E 3 API (character generation)
  - OpenAI GPT-Image-1 API (animations)
  - GPT-4o-mini (chat routing)
- **State Management**: Modular JavaScript state system
- **Build Tools**: Node.js configuration scripts

### API Model Usage
- **DALL-E 3**: Text-to-image generation for initial character creation
- **GPT-Image-1**: Image-to-image editing for animations and style transfers
- **GPT-4o-mini**: Natural language processing for request classification

### Key Components
- **`chatRouter.js`**: AI-powered request classification and routing
- **`api.js`**: Dual API key management and OpenAI integration
- **`state.js`**: Application state management with environment configuration
- **`wizard.js`**: Multi-step workflow management
- **`prompts.js`**: Comprehensive prompt engineering for optimal results

## 🔒 Privacy & Security

- **Local Processing**: All logic runs in your browser
- **Secure API Keys**: Environment-based configuration with build-time injection
- **No Data Transmission**: Only communicates directly with OpenAI APIs
- **Transparent Background Support**: Production-ready sprite output

## ⚙️ Configuration

### Environment Variables
```bash
# Required in .env.local
DALL_E_3_API_KEY=sk-your-dalle3-key-here
GPT_IMAGE_1_API_KEY=sk-your-gpt-image1-key-here
```

### Build Configuration
```bash
# Generate config.js from environment
npm run build:config
```

### Development Server
```bash
# Python HTTP server (recommended)
python3 -m http.server 8080

# Access at: http://localhost:8080/spriteforge/
```

## 🎨 Customization

### Adding New Styles
Edit `js/prompts.js` to add new game art styles with:
- Style definitions
- Technical specifications
- Generation parameters

### Adding New Animations
Extend `ACTION_PROMPTS` in `js/prompts.js` with:
- Frame count specifications
- Frame-by-frame descriptions
- Animation metadata

## 🐛 Troubleshooting

### Common Issues

**❌ "API key not found"**
- Ensure `.env.local` contains both API keys
- Run `npm run build:config` after updating keys
- Check console for configuration errors

**❌ "Generation failed"**
- Verify API keys have correct model access
- Check OpenAI account credits and limits
- Review browser console for detailed error messages

**❌ "Server not starting"**
- Use Python HTTP server: `python3 -m http.server 8080`
- Avoid `npm run dev` due to Node.js version compatibility
- Ensure port 8080 is available

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Test** your changes thoroughly
4. **Commit** with descriptive messages
5. **Push** to your branch
6. **Open** a Pull Request

### Development Guidelines
- Maintain modular architecture
- Keep functions under 500 lines
- Add JSDoc comments for all functions
- Follow the existing code style
- Test with both API keys

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- **OpenAI** for providing DALL-E 3 and GPT-Image-1 APIs
- **Game Art Community** for inspiration and style references
- **Contributors** who help improve Pointer
- **Open Source Community** for tools and libraries 