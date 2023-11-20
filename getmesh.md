## Get mesh information

This endpoint provides meta and transform matrix about the mesh on the CupixWorks and the url to download raw.

`GET https://api.cupix.works/api/v1/meshes | https://api.cupix.works/api/v1/meshes/{id}`

| Attribute    | Type           | Required | Description                                   |
| :----------- | :------------- | :------- | :-------------------------------------------- |
| fields       | array of sting | true     | id,name,state,mesh_state,user,team,record,level,facility,workspace,meta,thumbnail_urls,created_at,updated_at,published_at,error_code,mesh_urls,resource_upload_url,permission,resource_state,filesize,firebase,cycle_state,cycle_state_updated_at,cycle_state_updated_by,use_georeference,georeference,constants        |
| id | string        | false    | Only when called for a specific mesh id |
| record_id | string        | false    | when search only meshes in a specific record |
| page         | integer        | false    | page index to search per page                 |
| per_page     | integer        | false    | Number of items to GET per page               |


### Sample request

```js
request.get(`https://api.cupix.works/api/v1/meshes/185`, {
    method:'GET',
    Accept: 'application/json',
    json: true, 
    qs : {
        fields : 'id,state,meta',
    },
    headers: {
    'x-cupix-auth' : <your_access_token>
    }
})
```

### Sample response

The *wtm* of *user_prop* is transform matrix information, and *user_prop* is not sent if the mesh is not transformed in the Capture Editor.

```js
Status Code 200 : {
  "result": {
    "data": {
      "id": "186",
      "type": "mesh",
      "attributes": {
        "id": 186,
        "state": "done",
        "meta": {
          "prop": {
            "ver": 1,
            "bounding_box": {
              "min": [
                -1245.0472412109375,
                -941.950439453125,
                -9.877176284790039
              ],
              "max": [
                1499.97119140625,
                1043.0157470703125,
                486.8825378417969
              ]
            },
            "face_count": 24512,
            "vertex_count": 14632,
            "original_file_name": "vanvorst-zup.gltf",
            "original_size_in_mb": 0.7851247787475586
          },
          "user_prop": {
            "ver": 1,
            "locked": false,
            "visible": true,
            "enabled": true,
            "tm": [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1
            ],
            "wtm": [
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              1
            ],
            "scale": [
              1,
              1,
              1
            ],
            "wscale": [
              1,
              1,
              1
            ],
            "unit": {
              "ver": 1,
              "label": "m",
              "scale_factor": 1
            }
          }
        }
      }
    }
  },
  "session": null
}
```