
var spec = fetch('./openapi.json', {method: 'GET'}, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin"}).then(res => res.ok && res.json());