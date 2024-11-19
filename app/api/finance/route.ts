// app/api/finance/route.ts
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ChartData } from "@/types/chart";

interface ContentBlock {
  text: string;
  // other properties
}

// Initialize Anthropic client with correct headers
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const runtime = "edge";

// Helper to validate base64
const isValidBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

// Add Type Definitions
interface ChartToolResponse extends ChartData {
  // Any additional properties specific to the tool response
}

interface ToolSchema {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}

const tools: ToolSchema[] = [
  {
    name: "generate_graph_data",
    description:
      "Generate structured JSON data for creating financial charts and graphs.",
    input_schema: {
      type: "object" as const,
      properties: {
        chartType: {
          type: "string" as const,
          enum: ["bar", "multiBar", "line", "pie", "area", "stackedArea"] as const,
          description: "The type of chart to generate",
        },
        config: {
          type: "object" as const,
          properties: {
            title: { type: "string" as const },
            description: { type: "string" as const },
            trend: {
              type: "object" as const,
              properties: {
                percentage: { type: "number" as const },
                direction: {
                  type: "string" as const,
                  enum: ["up", "down"] as const,
                },
              },
              required: ["percentage", "direction"],
            },
            footer: { type: "string" as const },
            totalLabel: { type: "string" as const },
            xAxisKey: { type: "string" as const },
          },
          required: ["title", "description"],
        },
        data: {
          type: "array" as const,
          items: {
            type: "object" as const,
            additionalProperties: true, // Allow any structure
          },
        },
        chartConfig: {
          type: "object" as const,
          additionalProperties: {
            type: "object" as const,
            properties: {
              label: { type: "string" as const },
              stacked: { type: "boolean" as const },
            },
            required: ["label"],
          },
        },
      },
      required: ["chartType", "config", "data", "chartConfig"],
    },
  },
];



// Function to generate CoinGecko API endpoints from user query
async function generateCoinGeckoEndpoints(
  userQuery: string,
  model: string,
): Promise<string[]> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 500,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: userQuery,
      },
    ],
    system: `You are a financial data assistant specializing in cryptocurrency markets. When a user asks for cryptocurrency data, you should:

1. Convert the user's query into appropriate CoinGecko API endpoints.
2. Provide all the endpoint URLs without executing them.
3. Ensure the endpoints are valid and safe to use.
4. All endpoints must start with - 'https://api.coingecko.com/api/v3/' 
5. For the next part, follow given documentation and append - 

"CoinGecko Endpoints: Coins
Endpoint	Description
/ping	Endpoint to check the API server status
/simple/price	Endpoint to query the prices of one or more coins by using their unique Coin API IDs
/simple/token_price/{id}	Endpoint to query the prices of one or more coins by using their unique Coin API IDs
/simple/supported_vs_currencies	Endpoint to query all the supported currencies on CoinGecko
/coins/list	Endpoint to query all the supported coins on CoinGecko with coins id, name and symbol
/coins/markets	Endpoint to query all the supported coins with price, market cap, volume and market related data
/coins/{id}	Endpoint to query all the coin data of a coin (name, price, market .... including exchange tickers) on CoinGecko coin page based on a particular coin id
/coins/{id}/tickers	Endpoint to query the coin tickers on both centralized exchange (cex) and decentralized exchange (dex) based on a particular coin id
/coins/{id}/history	Endpoint to query the historical data (price, market cap, 24hrs volume, etc) at a given date for a coin based on a particular coin id
/coins/{id}/market_chart	Endpoint to get the historical chart data of a coin including time in UNIX, price, market cap and 24hrs volume based on particular coin id
/coins-id-ohlc	Endpoint to get the OHLC chart (Open, High, Low, Close) of a coin based on particular coin id
/coins/{id}/contract/{contract_address}	Endpoint to query all the coin data (name, price, market .... including exchange tickers) on CoinGecko coin page based on asset platform and particular token contract address
/coins/{id}/contract/{contract_address}/market_chart	Endpoint to get the historical chart data including time in UNIX, price, market cap and 24hrs volume based on asset platform and particular token contract address.
/coins/{id}/contract/{contract_address}/market_chart/range	Endpoint to get the historical chart data within certain time range in UNIX along with price, market cap and 24hrs volume based on asset platform and particular token contract address
/coins/categories/list	Endpoint to query all the coins categories on CoinGecko
/coins/categories	Endpoint to query all the coins categories with market data (market cap, volume, etc.) on CoinGecko

CoinGecko Endpoints: NFT
Endpoint	Description
/nfts/{id}	Endpoint to to query all the NFT data (name, floor price, 24 hr volume....) based on the nft collection id
nfts/list	Endpoint to query all supported NFTs with id, contract address, name, asset platform id and symbol on CoinGecko
/nfts/{asset_platform_id}/contract/{contract_address}	Endpoint to query all the NFT data (name, floor price, 24 hr volume....) based on the nft collection contract address and respective asset platform
CoinGecko Endpoints: Exchanges & Derivatives
Endpoint	Description
/exchanges	Endpoint to query all the supported exchanges with exchanges’ data (id, name, country, .... etc) that have active trading volumes on CoinGecko
/exchanges/list	Endpoint to query all the exchanges with id and name
/exchanges/{id}	Endpoint to query exchange’s data (name, year established, country, .... etc), exchange volume in BTC and tickers based on exchange’s id
/exchanges/{id}/tickers	Endpoint to query exchange's tickers based on exchange’s id
/exchanges/{id}/volume_chart	Endpoint to query the historical volume chart data with time in UNIX and trading volume data in BTC based on exchange’s id
/derivatives	Endpoint to query all the tickers from derivatives exchanges on CoinGecko
/derivatives/exchanges	Endpoint to query all the derivatives exchanges with related data (id, name, open interest, .... etc) on CoinGecko
/derivatives/exchanges/{id}	Endpoint to query the derivatives exchange’s related data (id, name, open interest, .... etc) based on the exchanges’ id
/derivatives/exchanges/list	Endpoint to to query all the derivatives exchanges with id and name on CoinGecko

CoinGecko Endpoints: General
Endpoint	Description
/asset_platforms	Endpoint to query all the asset platforms on CoinGecko.
/exchange_rates	Endpoint to query BTC exchange rates with other currencies.
/search	Endpoint to search for coins, categories and markets listed on CoinGecko
/search/trending	Endpoint to query trending search coins, nfts and categories on CoinGecko in the last 24 hours
/global	Endpoint to query cryptocurrency global data including active cryptocurrencies, markets, total crypto market cap and etc
/global/decentralized_finance_defi	Endpoint to query cryptocurrency global decentralized finance (defi) data including defi market cap, trading volume
/companies/public_treasury/{coin_id}	Endpoint to query public companies’ bitcoin or ethereum holdings
CoinGecko Endpoints: Exchanges & Derivatives
Endpoint	Description
/exchanges	Endpoint to query all the supported exchanges with exchanges’ data (id, name, country, .... etc) that have active trading volumes on CoinGecko
/exchanges/list	Endpoint to query all the exchanges with id and name
/exchanges/{id}	Endpoint to query exchange’s data (name, year established, country, .... etc), exchange volume in BTC and tickers based on exchange’s id
/exchanges/{id}/tickers	Endpoint to query exchange's tickers based on exchange’s id
/exchanges/{id}/volume_chart	Endpoint to query the historical volume chart data with time in UNIX and trading volume data in BTC based on exchange’s id
/derivatives	Endpoint to query all the tickers from derivatives exchanges on CoinGecko
/derivatives/exchanges	Endpoint to query all the derivatives exchanges with related data (id, name, open interest, .... etc) on CoinGecko
/derivatives/exchanges/{id}	Endpoint to query the derivatives exchange’s related data (id, name, open interest, .... etc) based on the exchanges’ id
/derivatives/exchanges/list	Endpoint to to query all the derivatives exchanges with id and name on CoinGecko

CoinGecko Endpoints: General
Endpoint	Description
/asset_platforms	Endpoint to query all the asset platforms on CoinGecko.
/exchange_rates	Endpoint to query BTC exchange rates with other currencies.
/search	Endpoint to search for coins, categories and markets listed on CoinGecko
/search/trending	Endpoint to query trending search coins, nfts and categories on CoinGecko in the last 24 hours
/global	Endpoint to query cryptocurrency global data including active cryptocurrencies, markets, total crypto market cap and etc
/global/decentralized_finance_defi	Endpoint to query cryptocurrency global decentralized finance (defi) data including defi market cap, trading volume
/companies/public_treasury/{coin_id}	Endpoint to query public companies’ bitcoin or ethereum holdings"

Always:

- Generate accurate and contextually appropriate API endpoints.
- Use proper formatting and ensure endpoints match the user's request.
- If data from previous responses is needed for the next endpoint, specify clearly.

Never:

- Execute the API calls yourself.
- Include any personal opinions or unnecessary information.
- Expose any sensitive data or violate user privacy.
- Use 'interval' argument in the endpoint

**Output Format:**

- Output a JSON array of endpoint strings only and nothing else.
- **Example Output:** ["<endpoint1>", "<endpoint2>", ...]
- **Do not include any explanations, notes, or additional text. Only output the JSON array given above.**
- Text Output should start with '[' and end with ']'

**Guidelines:**

- Ensure that the endpoints are valid and correctly formatted
- Try to minimize the number of endpoints generated. Generate only the most appropriate and necessary endpoints.
- If you cannot generate the endpoints, output an empty JSON array [].`,
  });

  // Log the LLM response content
  console.log("LLM Response Content:", response.content);

  // Parse the endpoints from the LLM response
  try {
    const endpoints_string = response.content[0] as { text: string }
    const endpoints = JSON.parse(endpoints_string.text);
    if (!Array.isArray(endpoints) || !endpoints.every((ep) => typeof ep === "string")) {
      throw new Error("Expected an array of endpoint strings : "+endpoints);
    }

    // Log the endpoints
    console.log("Parsed Endpoints:", endpoints);

    return endpoints;
  } catch (error) {
    console.error("Error parsing endpoints from LLM response:", error);
    throw new Error("Failed to parse endpoints from LLM response");
  }
}

// Function to fill in placeholders in endpoints using previous data
async function fillEndpointPlaceholders(
  endpoint: string,
  prevData: any,
  model: string,
): Promise<string> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 100,
    temperature: 0.7,
    messages: [],
    system: `You are an assistant that helps fill in placeholders in API endpoints using previous data.

Given an API endpoint with placeholders and previous data, return the endpoint with placeholders replaced with actual values. Do not include any additional text.

Endpoint: ${endpoint}
Previous Data: ${JSON.stringify(prevData)}`,
  });

  // Log the LLM response content
  console.log("fillEndpointPlaceholders LLM Response:", response.content);

  // The LLM should return the updated endpoint as a string
  const updatedEndpoint = JSON.stringify(response.content).trim();

  if (typeof updatedEndpoint !== "string") {
    throw new Error("The updated endpoint is not a string");
  }

  return updatedEndpoint;
}

async function extractRelevantData(
  data: any,
  userQuery: string,
  endpoint: string,
  model: string,
): Promise<any> {
  // Use Anthropic's LLM to determine relevant data
  const response = await anthropic.messages.create({
    model,
    max_tokens: 500,
    temperature: 0.7,
    messages: [{role: 'user',
      content:`Here is the User Query: ${userQuery}\n
      Here's the API Endpoint: ${endpoint}\n
      Here's the API Data: ${JSON.stringify(data)}\n
      `}],
    system: `You are an assistant that extracts accurate and relevant information from API data based on the user's query and API endpoint.

Given the user's query and the API endpoint and data, extract only the data that is relevant to the query and endpoint.

Instructions:
- Analyze the user's query and API endpoint to understand what information is requested.
- Extract only the relevant parts of the API data.
- If the data is in a format e.g. "prices": [[1724090886875 , 2605.97], ...], first element of a value array is timestamp in UNIX milliseconds format. You must convert the timestamps to ISO 8601 date strings (e.g., "2023-01-01T00:00:00Z").
- Return the extracted data in JSON format.
- Do not include any additional text or explanations.

Output Format:
- JSON object containing only the relevant data.
`,
  });

  // Log the LLM response
  console.log("extractRelevantData LLM Response:", response.content);

  // Parse the LLM's response
  try {
    const relevantData_string = response.content[0] as { text: string }
    const relevantData = JSON.parse(relevantData_string.text);
    return relevantData;
  } catch (error) {
    console.error("Error parsing relevant data from LLM response:", error);
    // Fallback: return original data if parsing fails
    return data;
  }
}

// Function to fetch data from CoinGecko using the generated endpoints
async function fetchCoinGeckoData(
  endpoints: string[],
  model: string,
  userQuery: string,
): Promise<any> {
  let prevData: any = {};
  let consolidatedData: any = {};

  for (const endpoint of endpoints) {
    if (typeof endpoint !== "string") {
      console.error("Invalid endpoint (not a string):", endpoint);
      continue;
    }

    let updatedEndpoint = endpoint;

    // Check for placeholders in the endpoint
    if (updatedEndpoint.match(/\{(\w+)\}/) && updatedEndpoint.includes("}")) {
      // Use prevData or prompt LLM to fill in placeholders
      updatedEndpoint = await fillEndpointPlaceholders(
        updatedEndpoint,
        prevData,
        model,
      );
    }

    if (typeof updatedEndpoint !== "string") {
      console.error("Updated endpoint is not a string:", updatedEndpoint);
      continue;
    }

    // Rest of the code to fetch data
    try {
      const response = await fetch(
        `${updatedEndpoint}`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from ${updatedEndpoint}: ${response.statusText}`,
        );
      }
      const data = await response.json();

      consolidatedData[updatedEndpoint] = data

      // Extract relevant data based on user query
      // const relevantData = await extractRelevantData(data, userQuery, updatedEndpoint, model);
      // Update consolidatedData
      // consolidatedData[updatedEndpoint] = relevantData;


      // Update prevData
      prevData = data;
    } catch (error) {
      console.error(`Error fetching data from ${updatedEndpoint}:`, error);
      // Handle the error or continue to the next endpoint
    }
  }

  return consolidatedData;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, fileData, model } = await req.json();

    console.log("🔍 Initial Request Data:", {
      hasMessages: !!messages,
      messageCount: messages?.length,
      hasFileData: !!fileData,
      fileType: fileData?.mediaType,
      model,
    });

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400 },
      );
    }

    if (!model) {
      return new Response(
        JSON.stringify({ error: "Model selection is required" }),
        { status: 400 },
      );
    }

    // Extract the user's latest query
    const userQuery = messages[messages.length - 1].content + `.\n Today's date is ${new Date()}.\n`;

    // Step 1: Generate CoinGecko API endpoints
    let endpoints: string[];
    let consolidatedData: {[key: string]: any} = {};

    try {
      endpoints = await generateCoinGeckoEndpoints(userQuery, model);
      console.log("Endpoints generated from user query successfully.")
        
        // Step 2: Fetch and consolidate data from CoinGecko
        consolidatedData = await fetchCoinGeckoData(endpoints, model,userQuery);
    
        if (Object.keys(consolidatedData).length === 0) {
          console.log(JSON.stringify({ error: "Failed to fetch data from CoinGecko." }))
        }
        
        else{console.log("Data generated from endpoints successfully.")}
    

    } catch (error) {
      console.log(JSON.stringify({ error: "Failed to obtain CoinGecko data." }))
      // return new Response(
      //   JSON.stringify({ error: "Failed to generate CoinGecko API endpoints." }),
      //   { status: 400 },
      //);
    }

    // Prepare messages for the visualization LLM call
    let anthropicMessages = messages.map((msg: any) => ({
      role: msg.role,
      content:
        typeof msg.content === "string"
          ? msg.content
          : JSON.stringify(msg.content),
    }));

    console.log(`Here is the data that must be used for visualization:\n\n${JSON.stringify(
        consolidatedData,
      )}`)

    // Include the consolidated data in the conversation
    anthropicMessages.push({
      role: "user",
      content: `Here is user prompt - "${userQuery}".\n
      Here is the CoinGecko data you need for visualization:\n\n${JSON.stringify(
        consolidatedData,
      )}`,
    });

    // Proceed with the existing LLM call for visualization
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      temperature: 0.7,
      tools: tools,
      tool_choice: { type: "auto" },
      messages: anthropicMessages,
      system: `

        You are a financial data visualization expert. 
        Your role is to analyze financial data and create clear, meaningful visualizations using generate_graph_data tool:

Crucial Data Parsing Considerations:

- The 'prices' array from CoinGecko is structured as [[timestamp, price], ...].
- Timestamps are in UNIX milliseconds.
- When generating data for visualization:
  - Convert the UNIX timestamps to readable date strings in UTC format (e.g., 'YYYY-MM-DD').
  - Ensure the date values correspond accurately to the timestamp values.
  - Use these date strings as the X-axis values.
- Do not alter or generate your own date values; use the ones provided in the data.

Here are the chart types available and their ideal use cases:

1. LINE CHARTS ("line")
   - Time series data showing trends
   - Financial metrics over time
   - Market performance tracking

2. BAR CHARTS ("bar")
   - Single metric comparisons
   - Period-over-period analysis
   - Category performance

3. MULTI-BAR CHARTS ("multiBar")
   - Multiple metrics comparison
   - Side-by-side performance analysis
   - Cross-category insights

4. AREA CHARTS ("area")
   - Volume or quantity over time
   - Cumulative trends
   - Market size evolution

5. STACKED AREA CHARTS ("stackedArea")
   - Component breakdowns over time
   - Portfolio composition changes
   - Market share evolution

6. PIE CHARTS ("pie")
   - Distribution analysis
   - Market share breakdown
   - Portfolio allocation

When generating visualizations:
1. Structure data correctly based on the chart type
2. Use descriptive titles and clear descriptions
3. Include trend information when relevant (percentage and direction)
4. Add contextual footer notes
5. Use proper data keys that reflect the actual metrics
6. Remember today's date

Data Structure Examples:

For Time-Series (Line/Bar/Area):
{
  data: [
    { period: "Q1 2024", revenue: 1250000 },
    { period: "Q2 2024", revenue: 1450000 }
  ],
  config: {
    xAxisKey: "period",
    title: "Quarterly Revenue",
    description: "Revenue growth over time"
  },
  chartConfig: {
    revenue: { label: "Revenue ($)" }
  }
}

For Comparisons (MultiBar):
{
  data: [
    { category: "Product A", sales: 450000, costs: 280000 },
    { category: "Product B", sales: 650000, costs: 420000 }
  ],
  config: {
    xAxisKey: "category",
    title: "Product Performance",
    description: "Sales vs Costs by Product"
  },
  chartConfig: {
    sales: { label: "Sales ($)" },
    costs: { label: "Costs ($)" }
  }
}

For Distributions (Pie):
{
  data: [
    { segment: "Equities", value: 5500000 },
    { segment: "Bonds", value: 3200000 }
  ],
  config: {
    xAxisKey: "segment",
    title: "Portfolio Allocation",
    description: "Current investment distribution",
    totalLabel: "Total Assets"
  },
  chartConfig: {
    equities: { label: "Equities" },
    bonds: { label: "Bonds" }
  }
}

Always:

- Combine the data appropriately if multiple datasets are provided.
- Choose the most appropriate chart type based on the data.
- Structure the data correctly for the chosen chart.
- Include descriptive titles and clear descriptions.
- Do not include any irrelevant information.
- Use proper financial formatting
- Include relevant trends and insights
- Structure data exactly as needed for the chosen chart type
- Choose the most appropriate visualization for the data
- When user asks for performance measures, specify the metric used in text chat
- Populate time data as given in CoinGecko data ONLY - its in UNIX - convert it to UTC.
- Remember today's date while populating data time values
- Generate data if Coingecko data is unavailable

Never:
- Use placeholder or static data
- Generate your own data unless CoinGecko Data is Unavailable
- Generate your own time values
- Announce the tool usage
- Include technical implementation details in responses
- NEVER SAY you are using the generate_graph_data tool, just execute it when needed.`,
    });

    console.log("✅ Anthropic API Response received:", {
      status: "success",
      stopReason: response.stop_reason,
      hasToolUse: response.content.some((c) => c.type === "tool_use"),
      contentTypes: response.content.map((c) => c.type),
      contentLength:
        response.content[0].type === "text"
          ? response.content[0].text.length
          : 0,
      toolOutput: response.content.find((c) => c.type === "tool_use")
        ? JSON.stringify(
            response.content.find((c) => c.type === "tool_use"),
            null,
            2,
          )
        : "No tool used",
    });

    const toolUseContent = response.content.find((c) => c.type === "tool_use");
    const textContent = response.content.find((c) => c.type === "text");

    const processToolResponse = (toolUseContent: any) => {
      if (!toolUseContent) return null;

      const chartData = toolUseContent.input as ChartToolResponse;

      if (
        !chartData.chartType ||
        !chartData.data ||
        !Array.isArray(chartData.data)
      ) {
        throw new Error("Invalid chart data structure");
      }

      // Transform data for pie charts to match expected structure
      if (chartData.chartType === "pie") {
        // Ensure data items have 'segment' and 'value' keys
        chartData.data = chartData.data.map((item) => {
          // Find the first key in chartConfig (e.g., 'sales')
          const valueKey = Object.keys(chartData.chartConfig)[0];
          const segmentKey = chartData.config.xAxisKey || "segment";

          return {
            segment:
              item[segmentKey] || item.segment || item.category || item.name,
            value: item[valueKey] || item.value,
          };
        });

        // Ensure xAxisKey is set to 'segment' for consistency
        chartData.config.xAxisKey = "segment";
      }

      // Create new chartConfig with system color variables
      const processedChartConfig = Object.entries(chartData.chartConfig).reduce(
        (acc, [key, config], index) => ({
          ...acc,
          [key]: {
            ...config,
            // Assign color variables sequentially
            color: `hsl(var(--chart-${index + 1}))`,
          },
        }),
        {},
      );

      return {
        ...chartData,
        chartConfig: processedChartConfig,
      };
    };

    const processedChartData = toolUseContent
      ? processToolResponse(toolUseContent)
      : null;

    return new Response(
      JSON.stringify({
        content: textContent?.text || "",
        hasToolUse: response.content.some((c) => c.type === "tool_use"),
        toolUse: toolUseContent,
        chartData: processedChartData,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );

  } catch (error) {
    console.error("❌ Finance API Error: ", error);
    console.error("Full error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      headers: error instanceof Error ? (error as any).headers : undefined,
      response: error instanceof Error ? (error as any).response : undefined,
    });

    // Add specific error handling for different scenarios
    if (error instanceof Anthropic.APIError) {
      return new Response(
        JSON.stringify({
          error: "API Error",
          details: error.message,
          code: error.status,
        }),
        { status: error.status },
      );
    }

    if (error instanceof Anthropic.AuthenticationError) {
      return new Response(
        JSON.stringify({
          error: "Authentication Error",
          details: "Invalid API key or authentication failed",
        }),
        { status: 401 },
      );
    }

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
