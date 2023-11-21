# Introduction

You first need to understand the Pointcloud model. Pointcloud model of the Cupix has two main attributes: pointcloud_type and kind.

The pointcloud_type attribute has two possible values. If you upload an external pointcloud to Cupix, it will have the string value 'uploaded.' If it's a pointcloud generated by Cupix algorithms, it will have the string value '3d_reconstructed.'

Additionally, there's the kind attribute, which categorizes pointclouds as either a group(parent) or a sub(child). Each of them contains tm(transformation) information . In analogy, the sub pointcloud corresponds to a pano of Cupix model, and the group pointcloud corresponds to a cluster model. Both clusters and panos have their own tm information, and the final tm is calculated by combining these two. 

When you want to download a pointcloud, you cannot use the group pointcloud ID for downloading; you must always use the sub pointcloud ID.

Here's an explanation of the process to download a Pointcloud:

First, you need to query the IDs of the pointclouds you want to download. You can do this by `GET /pointclouds`. If you include 'meta' in the 'fields' parameter, you can retrieve not only the IDs but also the alignment-related tm(transformation) information.

There's also an API to specifically fetch the metadata for a particular pointcloud. You can use `GET /pointclouds/{id}/meta` to get the metadata for a specific pointcloud.

Once you have determined the ID of the pointcloud you want to download `/pointclouds/{id}/download` (and it must be of 'sub' kind), you can use the download API to receive a response. The response.url will be the URL with an authentication token for AWS storage. You can use this URL with a library, such as HTTPS, and make a GET request to download the file.


## Get a pointcloud list

<a id="opIdpointcloud_get_pointclouds"></a>

> Code samples

```http
GET https://api.cupix.works/api/v1/pointclouds?{queryString} HTTP/1.1
Host: api.cupix.works
Accept: application/json
```

```python
import requests
headers = {
  'Accept': 'application/json',

  'X-CUPIX-AUTH': <Your API Token>
}

# cpc generated by Cupix AI
r = requests.get('https://api.cupix.works/api/v1/pointclouds', params={
  'fields': 'id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type',
  'capture_id': {target capture_id},
  'pointcloud_type': '3d_reconstructed'
}, headers = headers)



# laser scan pointcloud
r = requests.get('https://api.cupix.works/api/v1/pointclouds', params={
  'fields': 'id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type',
  'record_id': {target record_id},
  'pointcloud_type': 'uploaded'
}, headers = headers)

print(r.json())

```


`GET /pointclouds`

<h3 id="pointcloud-list-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|fields|query|array[string]|true|Fields list to response id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type|
|record_id|query|integer(int64)|false|Record ID|
|cluster_id|query|integer(int64)|false|Cluster ID|
|capture_id|query|integer|false|Capture ID|
|pointcloud_type|query|[PointcloudType](#enumerated-values)|false|3d_reconstructed(cpc), uploaded(laser scan)|

#### Enumerated Values

|Parameter|Value|
|---|---|
|pointcloud_type|uploaded|
|pointcloud_type|3d_reconstructed|
|pointcloud_type|all|


> Example responses

> 200 Response

```json
{
  "result": {
    "data": [
      {
        "id": "5310",
        "type": "pointcloud",
        "attributes": {
          "id": 5310,
          "name": "12116.cpc",
          "state": "done",
          "editing_state": "skipped",
          "facility": {
          },
          "record": {
            "id": 602,
            "type": "Record"
          },
          "level": {
            "id": 20,
            "type": "Level"
          },
          "parent": {
            "id": 5309
          },
          "kind": "sub",
          "meta": {
            "prop": {
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
              "original_file_name": "3416.cpc",
              "original_point_count": 183918,
              "original_size_in_mb": 3.63
            },
            "potree": {
            }
          },
          "cluster": {
            "id": 3416,
            "name": "Cluster 1",
            "type": "Cluster"
          },
          "thumbnail_urls": null,
          "created_at": "2023-10-30T02:35:05.544Z",
          "updated_at": "2023-10-30T02:37:44.526Z",
          "published_at": null,
          "permission": "F",
          "use_georeference": false,
          "georeference": null,
          "constants": {
            "georeference": null
          },
          "pointcloud_type": "3d_reconstructed"
        }
      },
      {
        "id": "5309",
        "type": "pointcloud",
        "attributes": {
          "id": 5309,
          "name": "Cluster 1",
          "state": "done",
          "editing_state": "skipped",
          "facility": {
          },
          "record": {
          },
          "level": {
          },
          "parent": {
            "id": null
          },
          "kind": "group",
          "meta": {
            "prop": {
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
              ]
            },
            "processor_version": "187\td65714cae268815527ca333e78ec5043f3bed354\t20231025_004940"
          },
          "cluster": {
            "id": 3416,
            "name": "Cluster 1",
            "type": "Cluster"
          },
          "thumbnail_urls": null,
          "created_at": "2023-10-30T02:35:04.934Z",
          "updated_at": "2023-10-30T02:35:48.719Z",
          "published_at": null,
          "permission": "F",
          "use_georeference": false,
          "georeference": null,
          "constants": {
            "georeference": null
          },
          "pointcloud_type": "3d_reconstructed"
        }
      }
    ],
    "pagination": {
      "total_entries": 2,
      "total_pages": 1,
      "per_page": 30,
      "previous_page": null,
      "current_page": 1,
      "next_page": null
    }
  },
  "session": null
}
```

<h3 id="pointcloud-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Pointcloud list|PointcloudListResponse|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|ErrorResponse|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|

## Get a pointcloud

<a id="opIdpointcloud_get_pointcloud"></a>

> Code samples

```http
GET https://api.cupix.works/api/v1/pointclouds/{id}?{queryString} HTTP/1.1
Host: api.cupix.works
Accept: application/json
```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

r = requests.get('https://api.cupix.works/api/v1/pointclouds/{id}', params={
  'fields': 'id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type'
}, headers = headers)

print(r.json())

```

`GET /pointclouds/{id}`

<h3 id="get-pointcloud-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|Pointcloud ID|
|fields|query|array[string]|true|Fields list to response id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type|

> Example responses

> 200 Response

```json
 {
  "result": {
    "data": {
      "id": "5310",
      "type": "pointcloud",
      "attributes": {
        "id": 5310,
        "name": "3416.cpc",
        "state": "done",
        "editing_state": "skipped",
        "facility": {
        },
        "record": {
        },
        "level": {
        },
        "parent": {
          "id": 5309
        },
        "kind": "sub",
        "meta": {
          "prop": {
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
            "original_file_name": "406_3416.cpc",
            "original_point_count": 183918,
            "original_size_in_mb": 3.63
          },
          "potree": {
          }
        },
        "cluster": {
          "id": 3416,
          "name": "Cluster 1",
          "type": "Cluster"
        },
        "thumbnail_urls": null,
        "created_at": "2023-10-30T02:35:05.544Z",
        "updated_at": "2023-10-30T02:37:44.526Z",
        "published_at": null,
        "permission": "F",
        "use_georeference": false,
        "georeference": null,
        "constants": {
          "georeference": null
        },
        "pointcloud_type": "3d_reconstructed"
      }
    }
  },
  "session": null
}
```

<h3 id="get-pointcloud-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Pointcloud|PointcloudResponse|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|ErrorResponse|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
CupixAuth
</aside>


## Download the pointcloud

<a id="opIdpointcloud_download_pointcloud"></a>

> Code samples

```http
GET https://api.cupix.works/api/v1/pointclouds/{id}/download?x-cupix-auth={api_key} HTTP/1.1
Host: api.cupix.works
Accept: application/json

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

r = requests.get('https://api.cupix.works/api/v1/pointclouds/{id}/download', headers = headers)

https.get(r.url, {fileStream})

```

`GET /pointclouds/{id}/download`


<h3 id="pointcloud-download-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|Pointcloud ID|

> Example responses

The URL of this API response contains a URL where you can download the pointcloud directly. Please use this to download the pointcloud.

> 400 Response



<h3 id="pointcloud-download-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Redirect to pointcloud download link|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|



## Get the meta information of the pointcloud

<a id="opIdpointcloud_get_meta"></a>

> Code samples

```http
GET https://api.cupix.works/api/v1/pointclouds/{id}/meta?{queryString} HTTP/1.1
Host: api.cupix.works
Accept: application/json

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

r = requests.get('https://api.cupix.works/api/v1/pointclouds/{id}/meta', params={
  'fields': 'id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type'
}, headers = headers)

print(r.json())

```

`GET /pointclouds/{id}/meta`

<h3 id="get-pointcloud-meta-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|Pointcloud ID|
|fields|query|array[string]|true|Fields list to response id,name,state,editing_state,facility,record,level,parent,kind,meta,cluster,thumbnail_urls,created_at,updated_at,published_at,location,permission,use_georeference,georeference,constants,pointcloud_type|

> Example responses

> 200 Response

```json
{
  "result": {
    "prop": {
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
      "original_file_name": "algtest.3406_3416.cpc",
      "original_point_count": 183918,
      "original_size_in_mb": 3.63
    },
    "potree": {}
  },
  "session": null,
  "message": null
}
```

<h3 id="get-pointcloud-meta-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Meta information|MetaResponse|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|ErrorResponse|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|

