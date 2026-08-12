"use client";

import { useMemo } from "react";
import { Background, Controls, Edge, Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useTrainingStore } from "@/lib/store/trainingStore";

export function NeuralNetworkPanel() {
  const inputs = useTrainingStore((state) => state.inputs);
  const outputs = useTrainingStore((state) => state.outputs);
  const network = useTrainingStore((state) => state.network);

  const { nodes, edges } = useMemo(() => {
    const inputNodes: Node[] = inputs.map((input, index) => ({
      id: `input-${index}`,
      position: { x: 0, y: index * 72 },
      data: { label: `${input.label} ${Math.round(input.value * 100)}%` },
      style: nodeStyle(input.value)
    }));
    const hiddenNodes: Node[] = Array.from({ length: network.hidden.length || 6 }, (_, index) => ({
      id: `hidden-${index}`,
      position: { x: 235, y: index * 56 + 18 },
      data: { label: `H${index + 1} ${Math.round((network.hidden[index] ?? 0) * 100)}%` },
      style: nodeStyle(network.hidden[index] ?? 0)
    }));
    const outputNodes: Node[] = outputs.map((output, index) => ({
      id: `output-${index}`,
      position: { x: 470, y: index * 92 + 56 },
      data: { label: `${output.label} ${Math.round(output.value * 100)}%` },
      style: nodeStyle(output.value)
    }));
    const nextEdges: Edge[] = [
      ...inputNodes.flatMap((input, inputIndex) =>
        hiddenNodes.map((hidden, hiddenIndex) => {
          const weight = network.weights[0]?.[hiddenIndex]?.[inputIndex] ?? 0;
          return {
          id: `${input.id}-${hidden.id}`,
          source: input.id,
          target: hidden.id,
          animated: Math.abs(weight) > 0.55,
          style: edgeStyle(weight)
          };
        })
      ),
      ...hiddenNodes.flatMap((hidden, hiddenIndex) =>
        outputNodes.map((output, outputIndex) => {
          const weight = network.weights[1]?.[outputIndex]?.[hiddenIndex] ?? 0;
          return {
          id: `${hidden.id}-${output.id}`,
          source: hidden.id,
          target: output.id,
          animated: Math.abs(weight) > 0.55,
          style: edgeStyle(weight)
          };
        })
      )
    ];

    return { nodes: [...inputNodes, ...hiddenNodes, ...outputNodes], edges: nextEdges };
  }, [inputs, network, outputs]);

  return (
    <div className="glass min-h-[360px] rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Neural Network</h2>
          <p className="text-sm text-slate-400">Live activations from input layer to decisions.</p>
        </div>
        <span className="rounded-full border border-cyan-neon/25 px-3 py-1 text-xs text-cyan-soft">Realtime</span>
      </div>
      <div className="h-72 overflow-hidden rounded-lg border border-white/10 bg-navy-950/70">
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false} panOnDrag zoomOnScroll>
            <Background color="rgba(56,216,255,0.16)" gap={24} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

function nodeStyle(value: number) {
  const intensity = Math.round(0.18 + value * 0.5);
  return {
    width: 130,
    border: "1px solid rgba(56,216,255,0.35)",
    borderRadius: 8,
    background: `rgba(56,216,255,${intensity / 10})`,
    color: "#eafcff",
    boxShadow: `0 0 ${12 + value * 18}px rgba(56,216,255,0.32)`,
    fontSize: 12
  };
}

function edgeStyle(weight: number) {
  return {
    stroke: weight >= 0 ? "#38d8ff" : "#ff4fd8",
    strokeWidth: 1 + Math.min(3, Math.abs(weight) * 2),
    opacity: 0.2 + Math.min(0.7, Math.abs(weight) * 0.45)
  };
}
