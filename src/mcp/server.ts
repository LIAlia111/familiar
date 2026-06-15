import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";

export async function runMcpServer(): Promise<void> {
  const server = new Server(
    { name: "familiar", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
