import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadState, saveState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { applyAction, affectionLabel, type ActionKind } from "../state/affection.js";
import { speak } from "../brain/speak.js";
import { DefaultBackend } from "../memory/default.js";
import { familiarHome, memoryDir } from "../util/paths.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";

const TOOLS: Tool[] = [
  {
    name: "familiar_status",
    description:
      "Get your familiar pet's current status: name, species, affection (0-100), relationship label, mood, and last interaction time.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "familiar_speak",
    description:
      "Ask your familiar pet to say something. Returns a phrase based on its personality and current mood.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "familiar_interact",
    description:
      "Interact with your familiar pet to increase affection. Cooldowns: pet 30min, feed 1h, play 30min.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["pet", "feed", "play"],
          description: "Type of interaction",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "familiar_remember",
    description:
      "Store a memory note for your familiar pet, persisted to ~/.familiar/memory.json.",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The memory to store (free text)",
        },
      },
      required: ["content"],
    },
  },
];

function memoryFile(): string {
  return join(familiarHome(), "memory.json");
}

function readMemories(): string[] {
  try {
    const parsed = JSON.parse(readFileSync(memoryFile(), "utf8")) as {
      memories?: unknown;
    };
    if (Array.isArray(parsed.memories)) return parsed.memories as string[];
  } catch {}
  return [];
}

function writeMemories(memories: string[]): void {
  const home = familiarHome();
  if (!existsSync(home)) mkdirSync(home, { recursive: true, mode: 0o700 });
  writeFileSync(memoryFile(), JSON.stringify({ memories }, null, 2), {
    mode: 0o600,
  });
}

export function registerTools(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case "familiar_status": {
        const state = loadState();
        if (!state)
          return {
            content: [
              {
                type: "text",
                text: "No familiar found. Run: npx claude-familiar install",
              },
            ],
          };
        const pet = getActivePet(state);
        if (!pet)
          return { content: [{ type: "text", text: "Active pet not found." }] };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  name: pet.name,
                  species: state.activeSpecies,
                  affection: pet.affection,
                  relationship: affectionLabel(pet.affection),
                  mood: pet.mood,
                  lastInteraction: pet.lastInteractionAt,
                  totalInteractions: pet.totalInteractions,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "familiar_speak": {
        const state = loadState();
        if (!state)
          return { content: [{ type: "text", text: "No familiar found." }] };
        const petEntry = getActivePet(state);
        const petDef = getPet(state.activeSpecies);
        if (!petEntry || !petDef)
          return { content: [{ type: "text", text: "Active pet not found." }] };
        const ctx = await new DefaultBackend({
          cwd: process.cwd(),
          memoryDir: memoryDir(),
        }).fetchContext();
        const line = await speak({
          personality: petDef.personality,
          templateKey: "ambient_random",
          trigger: "mcp_query",
          petName: petEntry.name,
          affection: petEntry.affection,
          recentQuotes: petEntry.recentQuotes,
          context: ctx,
          useApi: false,
        });
        return {
          content: [{ type: "text", text: `${petEntry.name}: ${line}` }],
        };
      }

      case "familiar_interact": {
        const action = (args as Record<string, unknown>).action as string;
        if (!["pet", "feed", "play"].includes(action))
          return {
            content: [
              { type: "text", text: "action must be one of: pet, feed, play" },
            ],
            isError: true,
          };
        const state = loadState();
        if (!state)
          return { content: [{ type: "text", text: "No familiar found." }] };
        const petEntry = getActivePet(state);
        if (!petEntry)
          return { content: [{ type: "text", text: "Active pet not found." }] };
        const result = applyAction(petEntry, action as ActionKind);
        petEntry.totalInteractions += 1;
        petEntry.lastInteractionAt = new Date().toISOString();
        saveState(state);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  action,
                  affection: petEntry.affection,
                  relationship: affectionLabel(petEntry.affection),
                  delta: result.delta,
                  reason: result.reason,
                  onCooldown: result.onCooldown,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "familiar_remember": {
        const content = (args as Record<string, unknown>).content as string;
        if (!content || typeof content !== "string")
          return {
            content: [{ type: "text", text: "content is required" }],
            isError: true,
          };
        const entry = `[${new Date().toISOString()}] ${content}`;
        writeMemories([entry, ...readMemories()].slice(0, 100));
        return {
          content: [{ type: "text", text: `Memory stored: ${entry}` }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  });
}
