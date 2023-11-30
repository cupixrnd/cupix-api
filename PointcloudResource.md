
# Introduction
<br>
The ply and mesh extracted from the cpc are stored in a model called ***Resource***, which is a submodel of ***Pointcloud***, a model on the server. So, you should know the ID of the CPC which is the pointcloud model, before try to download its resources. 
As explained in the Pointcloud model, pointclouds whose kind is group do not have any files, so you should know the id of the pointcloud **whose kind is sub**.
Also, you can check the ***mesh_uploaded_at*** and ***ply_uploaded_at*** fields of the ***[Pointcloud model](<Pointcloud.md>)*** to check whether the mesh or ply of the cpc exists.

## Get a pointcloud resources list

`GET /pointclouds/{id}/resources`
<a id="opIdpointcloud_get_pointcloud_resources"></a>

> Code samples

```http
GET https://api.cupix.works/api/v1/pointclouds/{id}/resources HTTP/1.1
Host: api.cupix.works
Accept: application/json
```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

# ID of pointcloud whose kind property is sub
r = requests.get('https://api.cupix.works/api/v1/pointclouds/{id}/resources', params={
  'fields': 'id, name, kind, mesh_uploaded_at, ply_uploaded_at',
}, headers = headers)



print(r.json())

```


<h3 id="pointcloud-list-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|query|integer(int64)|false|Pointcloud ID (kind: sub)|
|fields|query|array[string]|true|Fields list to response <br> id, name, kind|


> Example responses

> 200 Response

```json
{
  "result": {
    "data": [
      {
        "id": "1",
        "type": "resource",
        "attributes": {
          "name": "test.76989_69434.cpc",
          "kind": null
        }
      },
      {
        "id": "2",
        "type": "resource",
        "attributes": {
          "name": "test.76989_69434_ref_planes.json",
          "kind": "plane"
        }
      },
      {
        "id": "3",
        "type": "resource",
        "attributes": {
          "name": "test.76989_69434_mesh.zip",
          "kind": "mesh"
        }
      },
      {
        "id": "4",
        "type": "resource",
        "attributes": {
          "name": "test.76989_69434_pointcloud.ply",
          "kind": "ply"
        }
      }
    ],
    "pagination": null
  },
  "session": null
}
```

<h3 id="pointcloud-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Pointcloud list|PointcloudResourceListResponse|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|ErrorResponse|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|



## Download the resource of the pointcloud

`GET /pointclouds/{id}/resources/{kind}/download
<a id="opIdpointcloud_download_pointcloud_resource"></a>

> Code samples

```http
GET https://api.cupix.works/api/v1/pointclouds/{id}/resources/{kind}/download?x-cupix-auth={api_key} HTTP/1.1
Host: api.cupix.works
Accept: application/json
```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

# If the kind of the resource you want is mesh,
r = requests.get('https://api.cupix.works/api/v1/pointclouds/{id}/resources/mesh/download', headers = headers)

https.get(r.url, {fileStream})

# If the kind of the resource you want is ply,
r = requests.get('https://api.cupix.works/api/v1/pointclouds/{id}/resources/ply/download', headers = headers)

https.get(r.url, {fileStream})


```

<h3 id="pointcloud-resource-download-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|Pointcloud ID|
|kind|path|string|true|mesh|ply|

> Example responses

The URL of this API response contains a URL where you can download the resources of the pointcloud directly. Please use this to download the mesh/ply resource.

> 400 Response

<h3 id="pointcloud-download-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Redirect to pointcloud download link|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|


