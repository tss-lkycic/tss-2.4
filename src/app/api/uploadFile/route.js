import OpenAI from "openai";
// import fs from "fs";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req) {
  // Check if a file is uploaded in the request
  if (!req.files || !req.files.file) {
    throw new Error("No file uploaded");
  }

  const uploadedFile = req.files.file;
  console.log(uploadedFile, "hellooo");

  const file = await openai.files.create({
    file: uploadedFile.data,
    purpose: "assistants",
  });

  console.log(file, "hellooo 2");

  const assistant = await openai.beta.assistants.create({
    name: "career coach",
    description:
      "you are a bot specialised in reading resumes and giving job advice.",
    model: "gpt-4",
    tools: [{ type: "retrieval" }],
    file_ids: [file.id],
  });

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "please extract all job titles and tasks in this resume.",
    file_ids: [file.id],
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
    instructions: "",
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const outputMessages = messages.data.map((message) => ({
      role: message.role,
      content: message.content[0].text.value,
    }));
    return outputMessages; // Return the output messages
  } else {
    throw new Error(`Run status: ${run.status}`);
  }
}
