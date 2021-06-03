const Resource = (apiRoot, resName) => ({
  create: function create(payload) {
    return fetch(`${apiRoot}/${resName}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-type": "application/json" },
    });
  },
  read: function read(resID) {
    return fetch(`${apiRoot}/${resName}/${resID}`, {
      method: "GET",
    });
  },
  readall: function read() {
    return fetch(`${apiRoot}/${resName}`, {
      method: "GET",
    });
  },
  update: function update(payload) {
    return fetch(`${apiRoot}/${resName}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-type": "application/json" },
    });
  },
  delete: function del(resID) {
    return fetch(`${apiRoot}/${resName}/${resID}`, {
      method: "DELETE",
    });
  },
  command: function custom(path, payload) {
    return fetch(`${apiRoot}/${resName}/${path}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-type": "application/json" },
    });
  },
});

export const APIClient = (apiRoot) => ({
  flows: Resource(apiRoot, "flow"),
  operations: Resource(apiRoot, "operation"),
  nodes: Resource(apiRoot, "node"),
});

export default APIClient;
