const PriorityQueue = require("priorityqueuejs"); // Install using: npm install priorityqueuejs

// Graph representation using an adjacency list
class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(id, coordinates) {
    this.nodes.set(id, { id, coordinates, neighbors: new Map() });
  }

  addEdge(sourceId, targetId, weight) {
    this.nodes.get(sourceId).neighbors.set(targetId, weight);
    this.nodes.get(targetId).neighbors.set(sourceId, weight);
  }
}

function calculateDistance(coord1, coord2) {
  // Calculate the distance between two points (coordinates)
  const [x1, y1] = coord1;
  const [x2, y2] = coord2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function komiwojażera(graph, startId, endId) {
  const distances = new Map();
  const previous = new Map();
  const queue = new PriorityQueue(
    (a, b) => distances.get(a) - distances.get(b)
  );

  // Initialize distances and previous nodes
  graph.nodes.forEach((node) => {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
  });
  distances.set(startId, 0);

  queue.enq(startId);

  while (!queue.isEmpty()) {
    const currentId = queue.deq();

    if (currentId === endId) {
      break; // Reached the destination node, exit the loop
    }

    const currentNode = graph.nodes.get(currentId);
    currentNode.neighbors.forEach((weight, neighborId) => {
      const distance = distances.get(currentId) + weight;
      if (distance < distances.get(neighborId)) {
        distances.set(neighborId, distance);
        previous.set(neighborId, currentId);
        queue.enq(neighborId);
      }
    });
  }

  // Reconstruct the shortest path
  const shortestPath = [];
  let currentId = endId;
  while (currentId !== null) {
    shortestPath.unshift(currentId);
    currentId = previous.get(currentId);
  }

  return { path: shortestPath, distance: distances.get(endId) };
}

// Example usage
const graph = new Graph();
graph.addNode("A", [0, 0]);
graph.addNode("B", [1, 2]);
graph.addNode("C", [3, 1]);
graph.addNode("D", [2, 3]);
graph.addNode("E", [4, 4]);

graph.addEdge("A", "B", calculateDistance([0, 0], [1, 2]));
graph.addEdge("B", "C", calculateDistance([1, 2], [3, 1]));
graph.addEdge("C", "D", calculateDistance([3, 1], [2, 3]));
graph.addEdge("D", "E", calculateDistance([2, 3], [4, 4]));
graph.addEdge("A", "D", calculateDistance([0, 0], [2, 3]));

const startNode = "A";
const endNode = "E";

const result = komiwojażera(graph, startNode, endNode);
console.log("start:", startNode);
console.log("end:", endNode);
console.log("Shortest Path:", result.path);
console.log("Distance:", result.distance);
