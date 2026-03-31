import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";

// Fixed imports: AgentExecutor and createToolCallingAgent are in langchain/agents, not the root "langchain"
export function createAgent({ model, tools, systemPrompt }: any) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({ 
    llm: model, 
    tools, 
    prompt 
  });
  
  const executor = new AgentExecutor({ 
    agent, 
    tools,
    maxIterations: 3
  });

  return {
    invoke: async ({ messages }: { messages: { role: string; content: string }[] }) => {
      // Pass the most recent user message as input
      const lastMessage = messages[messages.length - 1].content;
      const result = await executor.invoke({ input: lastMessage });
      return { structuredResponse: result.output };
    },
  };
}
