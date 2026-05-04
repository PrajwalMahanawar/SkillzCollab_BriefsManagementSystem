import networkx as nx
import numpy as np


def build_brief_network(relationships):
    G = nx.DiGraph()

    for rel in relationships:
        source = rel.source_brief.id
        target = rel.target_brief.id

        G.add_node(source, title=rel.source_brief.name)
        G.add_node(target, title=rel.target_brief.name)

        G.add_edge(
            source, target, relationship_type=rel.relationship_type, weight=rel.weight
        )

    return G


def graph_to_json(G):
    nodes = []

    for node, data in G.nodes(data=True):
        nodes.append(
            {
                "id": node,
                "label": data.get("title", str(node)),
            }
        )

    edges = []

    for source, target, data in G.edges(data=True):
        edges.append(
            {
                "source": source,
                "target": target,
                "relationship_type": data.get("relationship_type"),
                "weight": data.get("weight", 1.0),
            }
        )

    return {"nodes": nodes, "edges": edges}


def structural_virality(subgraph):
    """
    Average pairwise shortest-path distance.
    Converts directed cascade to undirected for distance calculation.
    """

    if subgraph.number_of_nodes() <= 1:
        return 0

    undirected = subgraph.to_undirected()

    distances = []

    for component in nx.connected_components(undirected):
        component_graph = undirected.subgraph(component)
        path_lengths = dict(nx.all_pairs_shortest_path_length(component_graph))
        nodes = list(component_graph.nodes())

        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                distances.append(path_lengths[nodes[i]][nodes[j]])

    if not distances:
        return 0

    return float(np.mean(distances))


def calculate_cascade_metrics(G):
    """
    Calculates thesis-style cascade metrics for each root node.
    Root node = node with in-degree 0.
    """

    if G.number_of_nodes() == 0:
        return {}

    roots = [node for node in G.nodes() if G.in_degree(node) == 0]

    cascade_results = []

    for root in roots:
        reachable_nodes = nx.descendants(G, root)
        cascade_nodes = set(reachable_nodes)
        cascade_nodes.add(root)

        cascade_subgraph = G.subgraph(cascade_nodes).copy()

        # Cascade size
        cascade_size = cascade_subgraph.number_of_nodes()

        # Cascade depth
        depths = nx.single_source_shortest_path_length(G, root)
        cascade_depth = max(depths.values()) if depths else 0

        # Leaf nodes
        leaf_nodes = [
            node
            for node in cascade_subgraph.nodes()
            if cascade_subgraph.out_degree(node) == 0
        ]

        # Branching factor
        spreading_nodes = [
            node
            for node in cascade_subgraph.nodes()
            if cascade_subgraph.out_degree(node) > 0
        ]

        if spreading_nodes:
            branching_factor = np.mean(
                [cascade_subgraph.out_degree(node) for node in spreading_nodes]
            )
        else:
            branching_factor = 0

        cascade_results.append(
            {
                "root_id": root,
                "root_name": G.nodes[root].get("title", str(root)),
                "cascade_size": cascade_size,
                "cascade_depth": cascade_depth,
                "leaf_nodes": leaf_nodes,
                "leaf_count": len(leaf_nodes),
                "branching_factor": round(float(branching_factor), 3),
                "structural_virality": round(structural_virality(cascade_subgraph), 3),
            }
        )

    largest_cascade = (
        max(cascade_results, key=lambda x: x["cascade_size"])
        if cascade_results
        else None
    )

    return {
        "total_cascades": len(cascade_results),
        "largest_cascade": largest_cascade,
        "cascades": cascade_results,
    }


def calculate_network_metrics(G):
    if G.number_of_nodes() == 0:
        return {}

    degree_centrality = nx.degree_centrality(G)

    most_influential_node = (
        max(degree_centrality, key=degree_centrality.get) if degree_centrality else None
    )

    return {
        "nodes": G.number_of_nodes(),
        "edges": G.number_of_edges(),
        "most_influential_brief": {
            "id": most_influential_node,
            "name": G.nodes[most_influential_node].get("title"),
        },
        "degree_centrality": degree_centrality,
        "cascade_metrics": calculate_cascade_metrics(G),
    }
