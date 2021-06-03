if __name__ == "__main__":
    from flowpyapi.api import app
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8321)

    # def test_flow(input_path: str, output_path: str):
    #     from flowpyapi.flow import Flow
    #     from flowpyapi.edge import Edge
    #     from flowpyapi.nodes.inputs import InputCSVNode
    #     from flowpyapi.nodes.processors import (
    #         ProcessorQueryNode,
    #         ProcessorSelectColumnsNode,
    #     )
    #     from flowpyapi.nodes.outputs import OutputCSVNode

    #     node_in = InputCSVNode(input_path)
    #     node_filter = ProcessorQueryNode(query_string="id>=2")
    #     node_select = ProcessorSelectColumnsNode(columns=["col1", "col2"])
    #     node_out = OutputCSVNode(output_path)

    #     edge_list = [
    #         Edge(node_in, node_filter),
    #         Edge(node_filter, node_select),
    #         Edge(node_select, node_out),
    #     ]

    #     flow = Flow(edge_list)
    #     flow._process(node_in)

    # test_flow("./test/in.csv", "./test/out.csv")
