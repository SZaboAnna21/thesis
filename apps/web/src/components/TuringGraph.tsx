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
import type { TuringMachine } from "@fotoc/automata-core";
import { useTheme, type Theme } from "../theme";

const R = 28;

type NodeStatus = "active" | "idle";
type EdgeStatus = "active" | "idle";
type EdgeStyleMap = Record<EdgeStatus, { color: string; width: number }>;

const EDGE_STYLES: Record<Theme, EdgeStyleMap> = {
  light: {
    active: { color: "#7432cc", width: 3 },
    idle: { color: "#9ca3af", width: 1.5 },
  },
  dark: {
    active: { color: "#b68cff", width: 3 },
    idle: { color: "#6b7280", width: 1.5 },
  },
};

const NODE_STYLE: Record<NodeStatus, string> = {
  active: "border-brand-700 bg-brand-600 text-white shadow-lg shadow-brand-200",
  idle: "border-gray-500 bg-white text-gray-900",
};

type StateData = {
  label: string;
  isStart: boolean;
  isAccept: boolean;
  loopAngle: number;
  status: NodeStatus;
};
type TmStateNode = Node<StateData, "tmstate">;

type TransitionData = {
  labels: string[];
  status: EdgeStatus;
  bend: boolean;
  edgeStyle: EdgeStyleMap;
};
type TmTransitionEdge = Edge<TransitionData, "tmtransition">;

function getStates(tm: TuringMachine): string[] {
  const s = new Set([tm.startState, tm.acceptState, tm.rejectState]);
  for (const t of tm.transitions) { s.add(t.from); s.add(t.to); }
  return [...s];
}

function circleLayout(states: string[], tm: TuringMachine): TmStateNode[] {
  const n = states.length;
  const radius = n <= 1 ? 0 : Math.max(120, n * 45);
  return states.map((state, k) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * k) / n;
    return {
      id: state,
      type: "tmstate",
      position: { x: radius * Math.cos(angle) - R, y: radius * Math.sin(angle) - R },
      data: {
        label: state,
        isStart: state === tm.startState,
        isAccept: state === tm.acceptState,
        loopAngle: n <= 1 ? -Math.PI / 2 : angle,
        status: "idle",
      },
    };
  });
}

function buildEdges(tm: TuringMachine, activeState: string, edgeStyle: EdgeStyleMap): TmTransitionEdge[] {
  const grouped = new Map<string, { from: string; to: string; labels: string[] }>();
  for (const t of tm.transitions) {
    const id = `${t.from}->${t.to}`;
    if (!grouped.has(id)) grouped.set(id, { from: t.from, to: t.to, labels: [] });
    grouped.get(id)!.labels.push(`${t.read}/${t.write},${t.dir}`);
  }
  const edgeIds = new Set(grouped.keys());
  return [...grouped.entries()].map(([id, { from, to, labels }]) => {
    const status: EdgeStatus = from === activeState ? "active" : "idle";
    return {
      id,
      type: "tmtransition",
      source: from,
      target: to,
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeStyle[status].color, width: 16, height: 16 },
      zIndex: status === "active" ? 1 : 0,
      data: { labels, status, edgeStyle, bend: from !== to && edgeIds.has(`${to}->${from}`) },
    };
  });
}

type Props = { tm: TuringMachine; activeState: string };

export function TuringGraph({ tm, activeState }: Props) {
  const states = getStates(tm);
  const [nodes, setNodes] = useState(() => circleLayout(states, tm));
  const theme = useTheme();

  const shownNodes = nodes.map((node) => ({
    ...node,
    data: { ...node.data, status: (node.id === activeState ? "active" : "idle") as NodeStatus },
  }));

  return (
    <div className="h-72 rounded border bg-gray-50">
      <ReactFlow
        nodes={shownNodes}
        edges={buildEdges(tm, activeState, EDGE_STYLES[theme])}
        colorMode={theme}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={(changes: NodeChange<TmStateNode>[]) =>
          setNodes((ns) => applyNodeChanges(changes, ns))
        }
        fitView
        fitViewOptions={{ padding: 0.4 }}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
      />
    </div>
  );
}

function TmStateNodeView({ data }: NodeProps<TmStateNode>) {
  return (
    <div className="relative">
      {data.isStart && (
        <svg width="28" height="12" className="absolute top-1/2 right-full -translate-y-1/2 text-gray-600">
          <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
          <polygon points="20,1 28,6 20,11" fill="currentColor" />
        </svg>
      )}
      <div
        style={{ width: 2 * R, height: 2 * R }}
        className={
          "relative flex items-center justify-center rounded-full border-2 font-mono font-semibold transition-colors duration-300 " +
          NODE_STYLE[data.status]
        }
      >
        {data.isAccept && <div className="absolute inset-1 rounded-full border-2 border-current opacity-70" />}
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

function TmTransitionEdgeView({ source, target, data, markerEnd }: EdgeProps<TmTransitionEdge>) {
  const s = useInternalNode<TmStateNode>(source);
  const t = useInternalNode<TmStateNode>(target);
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
    const uy = (tc.y - sc.y) / len;
    const ux = (tc.x - sc.x) / len;
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

  const { color, width } = data.edgeStyle[data.status];
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={{ stroke: color, strokeWidth: width }} />
      <EdgeLabelRenderer>
        <div
          style={{ transform: `translate(-50%, -50%) translate(${label.x}px, ${label.y}px)`, borderColor: color }}
          className="nodrag nopan absolute rounded border bg-white px-1.5 font-mono text-xs"
        >
          {data.labels.map((l, k) => <span key={k}>{k > 0 && ", "}{l}</span>)}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = { tmstate: TmStateNodeView };
const edgeTypes = { tmtransition: TmTransitionEdgeView };
