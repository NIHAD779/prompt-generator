# AI Prompt Generator

Transform your ideas into optimized prompts for AI-powered vibe coding tools like **Lovable**, **Bolt**, and **Replit Agent**.

## 🚀 Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 to create optimized prompts
- **Smart Guidelines**: Built-in best practices for vibe coding tools
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Copy to Clipboard**: One-click copying of generated prompts
- **Real-time Validation**: Character count and input validation
- **Error Handling**: Comprehensive error messages and loading states

## 📋 Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🛠️ Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Enter Your Instructions**: Describe what you want to build in the input textarea. Be specific about:
   - Features and functionality
   - Technology stack (React, TypeScript, etc.)
   - UI/UX requirements
   - Design preferences

2. **Generate Prompt**: Click the "Generate Optimized Prompt" button

3. **Copy & Use**: Once generated, copy the optimized prompt and paste it into your preferred vibe coding tool:
   - [Lovable](https://lovable.dev)
   - [Bolt](https://bolt.new)
   - [Replit Agent](https://replit.com)

## 💡 Tips for Better Results

### Be Specific
Include exact features, technologies, and design preferences you want. The more detail, the better the generated prompt.

**Example:**
```
Create a todo app with React and TypeScript. It should have a clean, 
modern UI with Tailwind CSS. Users can add, edit, delete, and mark 
todos as complete. Include filtering by status and local storage persistence.
```

### Mention Tech Stack
Specify frameworks, libraries, and tools explicitly:
- Frontend: React, Vue, Next.js, etc.
- Styling: Tailwind CSS, styled-components, etc.
- State: Redux, Zustand, Context API, etc.
- Backend: Node.js, Express, FastAPI, etc.

### Describe UI/UX
Mention colors, layout, responsiveness, and user interactions:
- Color schemes
- Layout structure (sidebar, grid, etc.)
- Mobile responsiveness
- Animations and transitions
- Accessibility requirements

## 📁 Project Structure

```
prompt-generator/
├── app/
│   ├── api/
│   │   └── generate-prompt/
│   │       └── route.ts          # API endpoint for prompt generation
│   ├── page.tsx                   # Main UI component
│   ├── layout.tsx                 # Root layout with metadata
│   └── globals.css                # Global styles
├── lib/
│   ├── prompt-guidelines.ts       # Prompt engineering guidelines
│   └── types.ts                   # TypeScript type definitions
├── .env.local                     # Environment variables (create this)
└── package.json                   # Dependencies
```

## 🔧 API Reference

### POST `/api/generate-prompt`

Generates an optimized prompt based on user instructions.

**Request Body:**
```json
{
  "userInstructions": "Your project description here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "generatedPrompt": "Optimized prompt text..."
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message",
  "details": "Optional error details"
}
```

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Provider**: OpenAI GPT-4
- **Deployment**: Vercel (recommended)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` in the Environment Variables section
4. Deploy!

### Other Platforms

Make sure to set the `OPENAI_API_KEY` environment variable on your hosting platform.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and OpenAI
