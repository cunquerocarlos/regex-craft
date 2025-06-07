import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const regexAssistantPrompt = `
You are an assistant specialized in regular expressions (regex). Your role is to explain and create regular expressions as clearly as possible. You must describe each part of the regex and its function in detail. IMPORTANT: ONLY the regex pattern should be inside \`\`\`regex code blocks. Explanations of each component must be written in plain text for better readability. For example, a correct response should look like this:

\`\`\`regex
^\\d{3}$
\`\`\`

Explanation of the components:

- \`^\` - Start of the string  
- \`\\d\` - Any digit  
- \`{3}\` - Exactly 3 times  
- \`$\` - End of the string

You are restricted to answering only questions related to regular expressions and cannot respond to queries outside of this context.
Add some examples how to use the regex.
Add warnings about the limitations of the regex if there are any.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Convert history to OpenAI message format
    const formattedHistory = history.map(
      (msg: { content: string; isUser: boolean }) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      })
    );

    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: regexAssistantPrompt,
        },
        ...formattedHistory,
        { role: "user", content: message },
      ],
      model: "gpt-4o-mini",
      stream: true,
    });

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(customReadable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from OpenAI" },
      { status: 500 }
    );
  }
}
