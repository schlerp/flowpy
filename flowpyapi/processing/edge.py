from flowpyapi.nodes import Node


class Edge(object):
    def __init__(self, node_source: Node, node_target: Node):
        self.node_source = node_source
        self.node_target = node_target
