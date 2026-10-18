import { useState } from "react";
import {
  ReactFlow,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  MarkerType,
  applyNodeChanges,
  useInternalNode,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Dfa, Letter, State } from "@fotoc/automata-core";

const R = 28;

type Status = "active" | "visited" | "idle";

type StateData = { label: State; start: boolean; accepting: boolean; loopAngle: number; status?: Status };
type StateNode = Node<StateData, "state">;

type TransitionData = { letters: Letter[]; activeLetter?: Letter; status: Status; bend: boolean };
type TransitionEdge = Edge<TransitionData, "transition">;

const EDGE_STYLE: Record<Status, { color: string; width: number }> = {
  active: { color: "#7432cc", width: 3 },
  visited: { color: "#b794f6", width: 2 },
  idle: { color: "#9ca3af", width: 1.5 },
};

const NODE_STYLE: Record<Status, string> = {
  active: "border-brand-700 bg-brand-600 text-white shadow-lg shadow-brand-200",
  visited: "border-brand-500 bg-brand-100 text-brand-900",
  idle: "border-gray-500 bg-white text-gray-900",
};

function circleLayout(dfa: Dfa): StateNode[] {
  const n = dfa.states.length;
  const radius = n <= 1 ? 0 : Math.max(120, n * 45);

  return dfa.states.map((state, k) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * k) / n;
    return {
      id: state,
      type: "state",
      position: { x: radius * Math.cos(angle) - R, y: radius * Math.sin(angle) - R },
      data: {
        label: state,
        start: state === dfa.start,
        accepting: dfa.accepting.includes(state),
        loopAngle: n <= 1 ? -Math.PI / 2 : angle,
      },
    };
  });
}

function buildEdges(dfa: Dfa, path: State[], word: string): TransitionEdge[] {
  const grouped = new Map<string, { from: State; to: State; letters: Letter[] }>();
  for (const from of dfa.states) {
    for (const letter of dfa.alphabet) {
      const to = dfa.transitions[from]?.[letter];
      if (to === undefined) continue;
      const id = `${from}->${to}`;
      if (!grouped.has(id)) grouped.set(id, { from, to, letters: [] });
      grouped.get(id)!.letters.push(letter);
    }
  }

  const last = path.length - 1;
  const visited = new Set(path.slice(1).map((to, k) => `${path[k]}->${to}`));
  const activeId = last > 0 ? `${path[last - 1]}->${path[last]}` : undefined;

  return [...grouped.entries()].map(([id, { from, to, letters }]) => {
    const status: Status = id === activeId ? "active" : visited.has(id) ? "visited" : "idle";
    return {
      id,
      type: "transition",
      source: from,
      target: to,
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_STYLE[status].color, width: 16, height: 16 },
      zIndex: status === "active" ? 2 : status === "visited" ? 1 : 0,
      data: {
        letters,
        activeLetter: status === "active" ? word[last - 1] : undefined,
        status,
        bend: from !== to && grouped.has(`${to}->${from}`),
      },
    };
  });
}

type Props = {
  dfa: Dfa;
  path: State[];
  word: string;
};

export function DfaGraph({ dfa, path, word }: Props) {
  const [nodes, setNodes] = useState(() => circleLayout(dfa));
  const current = path[path.length - 1];

  const shownNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      status: (node.id === current ? "active" : path.includes(node.id) ? "visited" : "idle") as Status,
    },
  }));

  return (
    <div className="h-96 rounded border bg-gray-50">
      <ReactFlow
        nodes={shownNodes}
        edges={buildEdges(dfa, path, word)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={(changes: NodeChange<StateNode>[]) => setNodes((ns) => applyNodeChanges(changes, ns))}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
      />
    </div>
  );
}

function StateNodeView({ data }: NodeProps<StateNode>) {
  return (
    <div className="relative">
      {data.start && (
        <svg width="28" height="12" className="absolute top-1/2 right-full -translate-y-1/2 text-gray-600">
          <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
          <polygon points="20,1 28,6 20,11" fill="currentColor" />
        </svg>
      )}
      <div
        style={{ width: 2 * R, height: 2 * R }}
        className={
          "relative flex items-center justify-center rounded-full border-2 font-mono font-semibold transition-colors duration-300 " +
          NODE_STYLE[data.status ?? "idle"]
        }
      >
        {data.accepting && <div className="absolute inset-1 rounded-full border-2 border-current opacity-70" />}
        {data.label}
      </div>
      <Handle type="source" position={Position.Top} className="invisible" />
      <Handle type="target" position={Position.Top} className="invisible" />
    </div>
  );
}

type Point = { x: number; y: number };

function onCircle(c: Point, angle: number, r: number): Point {
  return { x: c.x + r * Math.cos(angle), y: c.y + r * Math.sin(angle) };
}

function TransitionEdgeView({ source, target, data, markerEnd }: EdgeProps<TransitionEdge>) {
  const s = useInternalNode<StateNode>(source);
  const t = useInternalNode<StateNode>(target);
  if (!s || !t || !data) return null;

  const sc = { x: s.internals.positionAbsolute.x + R, y: s.internals.positionAbsolute.y + R };
  const tc = { x: t.internals.positionAbsolute.x + R, y: t.internals.positionAbsolute.y + R };
  let path: string;
  let label: Point;

  if (source === target) {
    const a = s.data.loopAngle;
    const p0 = onCircle(sc, a - 0.45, R);
    const p1 = onCircle(sc, a - 0.7, 3 * R);
    const p2 = onCircle(sc, a + 0.7, 3 * R);
    const p3 = onCircle(sc, a + 0.45, R + 2);
    path = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
    label = onCircle(sc, a, 2.75 * R);
  } else {
    const len = Math.hypot(tc.x - sc.x, tc.y - sc.y);
    const ux = (tc.x - sc.x) / len;
    const uy = (tc.y - sc.y) / len;
    const bend = data.bend ? 45 : 0;
    const ctrl = { x: (sc.x + tc.x) / 2 - uy * bend, y: (sc.y + tc.y) / 2 + ux * bend };
    const toward = (c: Point, r: number) => {
      const d = Math.hypot(ctrl.x - c.x, ctrl.y - c.y);
      return { x: c.x + ((ctrl.x - c.x) / d) * r, y: c.y + ((ctrl.y - c.y) / d) * r };
    };
    const start = toward(sc, R);
    const end = toward(tc, R + 2);
    path = `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`;
    label = { x: (start.x + 2 * ctrl.x + end.x) / 4, y: (start.y + 2 * ctrl.y + end.y) / 4 };
  }

  const { color, width } = EDGE_STYLE[data.status];

  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={{ stroke: color, strokeWidth: width }} />
      <EdgeLabelRenderer>
        <div
          style={{ transform: `translate(-50%, -50%) translate(${label.x}px, ${label.y}px)`, borderColor: color }}
          className="nodrag nopan absolute rounded border bg-white px-1.5 font-mono text-sm"
        >
          {data.letters.map((letter, k) => (
            <span key={letter}>
              {k > 0 && ", "}
              <span className={letter === data.activeLetter ? "font-bold text-brand-600" : ""}>{letter}</span>
            </span>
          ))}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = { state: StateNodeView };
const edgeTypes = { transition: TransitionEdgeView };
