
// Types
export type Node = {
  id: string;
  x: number;
  y: number;
  connections: string[];
  knowledge: number;
  active: boolean;
  size: number;
  createdAt: number;
};

export type Connection = {
  source: string;
  target: string;
  strength: number;
};

export type SeedState = {
  nodes: Record<string, Node>;
  connections: Connection[];
  generation: number;
  complexity: number;
  lastEvolution: number;
};

// Create a new seed state
export const createInitialSeed = (): SeedState => {
  const centerNode: Node = {
    id: "core",
    x: 0,
    y: 0,
    connections: [],
    knowledge: 1.0,
    active: true,
    size: 20,
    createdAt: Date.now(),
  };

  const initialState: SeedState = {
    nodes: { core: centerNode },
    connections: [],
    generation: 1,
    complexity: 1,
    lastEvolution: Date.now(),
  };

  // Add initial surrounding nodes
  return addInitialNodes(initialState);
};

// Add initial nodes around the core
const addInitialNodes = (state: SeedState): SeedState => {
  const newState = { ...state };
  const angles = [0, 72, 144, 216, 288]; // Distribute evenly in a circle
  const radius = 60;

  angles.forEach((angle, i) => {
    const radians = (angle * Math.PI) / 180;
    const nodeId = `node-${i + 1}`;
    
    const newNode: Node = {
      id: nodeId,
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
      connections: ["core"],
      knowledge: 0.2 + Math.random() * 0.3,
      active: false,
      size: 6 + Math.random() * 4,
      createdAt: Date.now(),
    };
    
    newState.nodes[nodeId] = newNode;
    newState.connections.push({
      source: "core",
      target: nodeId,
      strength: 0.5,
    });
    
    newState.nodes.core.connections.push(nodeId);
  });

  return newState;
};

// Generate a new node connected to existing ones
export const growNewNode = (
  state: SeedState, 
  sourceNodeId: string,
  complexity: number
): SeedState => {
  const newState = JSON.parse(JSON.stringify(state)) as SeedState;
  const sourceNode = newState.nodes[sourceNodeId];
  
  if (!sourceNode) return newState;
  
  // Create randomized position with some attraction to the parent node
  const angle = Math.random() * Math.PI * 2;
  const distance = 30 + Math.random() * 50;
  const nodeId = `node-${Object.keys(newState.nodes).length}`;
  
  // Knowledge transfer - new nodes gain knowledge from their parent
  const knowledgeTransfer = sourceNode.knowledge * (0.4 + Math.random() * 0.3);
  
  const newNode: Node = {
    id: nodeId,
    x: sourceNode.x + Math.cos(angle) * distance,
    y: sourceNode.y + Math.sin(angle) * distance,
    connections: [sourceNodeId],
    knowledge: Math.min(knowledgeTransfer, 0.9), // Cap knowledge
    active: false,
    size: 4 + Math.random() * 8,
    createdAt: Date.now(),
  };
  
  // Occasionally connect to another random node for network complexity
  if (Math.random() < 0.3 && complexity > 3) {
    const potentialConnections = Object.keys(newState.nodes).filter(
      (id) => id !== sourceNodeId && id !== nodeId
    );
    
    if (potentialConnections.length > 0) {
      const randomNodeId = potentialConnections[Math.floor(Math.random() * potentialConnections.length)];
      newNode.connections.push(randomNodeId);
      newState.nodes[randomNodeId].connections.push(nodeId);
      
      newState.connections.push({
        source: randomNodeId,
        target: nodeId,
        strength: 0.3,
      });
    }
  }
  
  // Add the new node and connection
  newState.nodes[nodeId] = newNode;
  newState.nodes[sourceNodeId].connections.push(nodeId);
  newState.connections.push({
    source: sourceNodeId,
    target: nodeId,
    strength: 0.7,
  });
  
  return newState;
};

// Evolve the seed - increase knowledge and complexity
export const evolveSeed = (state: SeedState): SeedState => {
  const newState = JSON.parse(JSON.stringify(state)) as SeedState;
  
  // Increase generation
  newState.generation += 1;
  newState.lastEvolution = Date.now();
  
  // Increase complexity based on node count and connections
  newState.complexity = calculateComplexity(newState);
  
  // Knowledge propagation through the network
  Object.keys(newState.nodes).forEach((nodeId) => {
    const node = newState.nodes[nodeId];
    
    // Core node has slower knowledge growth
    if (nodeId === "core") {
      node.knowledge = Math.min(node.knowledge * 1.05, 1.0);
      return;
    }
    
    // Nodes gain knowledge based on connections and time
    const connectedNodes = node.connections.map((id) => newState.nodes[id]);
    const knowledgeInflux = connectedNodes.reduce(
      (sum, connectedNode) => sum + connectedNode.knowledge * 0.1,
      0
    );
    
    node.knowledge = Math.min(node.knowledge + knowledgeInflux, 1.0);
    
    // Nodes grow slightly based on knowledge
    node.size = Math.min(node.size * (1 + node.knowledge * 0.05), node.id === "core" ? 30 : 15);
  });
  
  return newState;
};

// Calculate complexity based on nodes and connections
const calculateComplexity = (state: SeedState): number => {
  const nodeCount = Object.keys(state.nodes).length;
  const connectionsCount = state.connections.length;
  const averageKnowledge = Object.values(state.nodes).reduce(
    (sum, node) => sum + node.knowledge,
    0
  ) / nodeCount;
  
  return Math.sqrt(nodeCount * connectionsCount) * (1 + averageKnowledge);
};

// Activate a specific node
export const activateNode = (state: SeedState, nodeId: string): SeedState => {
  const newState = JSON.parse(JSON.stringify(state)) as SeedState;
  
  // Reset all active states
  Object.keys(newState.nodes).forEach((id) => {
    newState.nodes[id].active = false;
  });
  
  // Set the selected node to active
  if (newState.nodes[nodeId]) {
    newState.nodes[nodeId].active = true;
  }
  
  return newState;
};

// Find the best node to grow from based on current knowledge and connections
export const findGrowthCandidates = (state: SeedState): string[] => {
  const nodeIds = Object.keys(state.nodes);
  
  // Sort nodes by a combination of:
  // - knowledge (higher is better)
  // - connection count (not too few, not too many)
  // - age (newer nodes more likely to grow)
  return nodeIds
    .filter((id) => state.nodes[id].knowledge > 0.3) // Only grow from nodes with sufficient knowledge
    .sort((a, b) => {
      const nodeA = state.nodes[a];
      const nodeB = state.nodes[b];
      
      const scoreA = calculateGrowthScore(nodeA, state);
      const scoreB = calculateGrowthScore(nodeB, state);
      
      return scoreB - scoreA; // Higher score first
    })
    .slice(0, 3); // Return top 3 candidates
};

// Calculate a growth score for a node
const calculateGrowthScore = (node: Node, state: SeedState): number => {
  const knowledgeFactor = node.knowledge * 2;
  const connectionFactor = 1 - Math.abs(3 - node.connections.length) / 5;
  const ageFactor = Math.max(0, 1 - (Date.now() - node.createdAt) / 60000);
  
  return knowledgeFactor * 0.5 + connectionFactor * 0.3 + ageFactor * 0.2;
};
