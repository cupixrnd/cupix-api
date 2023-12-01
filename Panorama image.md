# Pano


## Get Pano list or Get Pano info

`GET https://{team_domain}.cupix.works/api/v1/panos OR https://{team_domain}.cupix.works/api/v1/panos/{id}`

A pano's origin property tells you where this pano was created. If origin has video information, it was created from that video, and if origin is null, this pano is a still image, not a video.

Also, you can know if the pano is aligned by putting *cluster* in the fields.

| Attribute  | Type            | Required | Description                                                                                                                                                                                                                                                                   |
| :--------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fields     | array of string | true     | id,**origin**,**cluster**,name,state,created_at,updated_at,published_at,capture,level,record,location,geo_coordinate,meta,thumbnail_urls,tile_size,tile_download_urls,mask_state,mask_url,pano_type,revision_type,enhanced_image_revision,use_georeference,georeference,constants |
| capture_id | integer         | false    | id to filter the video ids to upload by the workspace                                                                                                                                                                                                                         |
| order_by   | string          | false    | Field name to order                                                                                                                                                                                                                                                           |
| sort       | string          | false    | Sort direction                                                                                                                                                                                                                                                                |
| page       | integer         | false    | page index to search per page                                                                                                                                                                                                                                                 |
| per_page   | integer         | false    | Item count per page                                                                                                                                                                                                                                                           |


### Sample request

```js
request.get(`https://{team_domain}.cupix.works/api/v1/panos`, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,origin',
		capture_id: 226700
    },
    headers: {
    'x-cupix-auth' : <YOUR_API_KEY>
    }
})
```

### Sample response

```js
...
  {
        "id": "11920979",
        "type": "pano",
        "attributes": {
          "id": 11920979,
          "origin": {
            "id": 93469,
            "name": "VID_20221027_153744_20221029001434-monostitch-5FPS.mp4",
            "type": "Video"
          }
        }
      },
      {
        "id": "11920839",
        "type": "pano",
        "attributes": {
          "id": 11920839,
          "origin": null
        }
      }
...
```


### Sample request
```js
request.get(`https://{team_domain}.cupix.works/api/v1/panos/11718780 `, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,cluster',
    },
    headers: {
    'x-cupix-auth' : <YOUR_API_KEY>
    }
})
```
### Sample response

```js
// If the pano is aligned,

Status Code 200 : {
  "result": {
    "data": {
      "id": "11718780",
      "type": "pano",
      "attributes": {
        "id": 11718780,
        "origin": {
          "id": 91552,
          "name": "VID_20221110_172255_5fps.mp4",
          "type": "Video"
        },
        "cluster": {
          "id": 224212,
          "name": "Cluster1",
          "type": "Cluster"
        }
      }
    }
  },
  "session": null
}

// else if it is unaligned 

Status Code 200 : {
  "result": {
    "data": {
      "id": "11717693",
      "type": "pano",
      "attributes": {
        "id": 11717693,
        "origin": null,
        "cluster": {
          "id": null,
          "name": null
        }
      }
    }
  },
  "session": null
}


```



## Update Pano bulk or Update one Pano 

`PUT https://{team_domain}.cupix.works/api/v1/panos OR https://{team_domain}.cupix.works/api/v1/panos/{id}`



| Attribute  | Type            | Required | Description                                                                                                                                                                                                                                                                   |
| :--------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fields     | array of string | true     | id,**origin**,**cluster**,name,state,created_at,updated_at,published_at,capture,level,record,location,geo_coordinate,meta,thumbnail_urls,tile_size,tile_download_urls,mask_state,mask_url,pano_type,revision_type,enhanced_image_revision,use_georeference,georeference,constants |
| capture_id | integer         | false    | id of the capture containing the panos you want to query                                                                                                                                                                        |
| bulk_action   | string          | false    | "update"                                                                                                                                                                                                                           |
| items       | array of object          | false    | An array of pano id and meta information to be updated at once                                                                                                                                                                                                                                                            |


### Sample request

```js
request.put(`https://{team_domain}.cupix.works/api/v1/panos`, {
    method:'PUT',
    Accept: 'application/json',
    json: true,
    qs : {
        fields : 'id,meta',
    },
      body : {
        "bulk_action": "update",
        "capture_id": <your capture_id>,
        "items": [
          {
            "id": <panoId>,
            "meta": <panoMeta>
          }
          ...
        ]

    },
    headers: {
    'x-cupix-auth' : <YOUR_API_KEY>
    }
})
```

### Sample response

```js
...
 {"result":[<panoId>, <panoId>, <panoId>, ...]}
...
```









## Publish or unpublish Pano

`PUT https://{team_domain}.cupix.works/api/v1/panos/{id}/publish`

`DELETE https://{team_domain}.cupix.works/api/v1/panos/{id}/publish`

You can publish/unpublish pano with the above call, and you can know whether it has been published/unpublished with the *published_at* value of the response. If *published_at* is null, it is unpublished, and if *published_at* has some value, it is published.

| Attribute  | Type            | Required | Description                                                                                                                                                                                                                                                                   |
|:----------|:----------|:----------|:----------|
| fields     | array of string | true     | id,**published_at**,origin,cluster,name,state,created_at,updated_at,capture,level,record,location,geo_coordinate,meta,thumbnail_urls,tile_size,tile_download_urls,mask_state,mask_url,pano_type,revision_type,enhanced_image_revision,use_georeference,georeference,constants |




### Sample request(publish)
```js
request.put(`https://{team_domain}.cupix.works/api/v1/panos/<your pano id>/publish`, {
    method: 'PUT',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,published_at',
    },
    headers: {
    'x-cupix-auth' : <YOUR_API_KEY>
    }
})
```
### Sample response(publish)

```js
Status Code 200 : {
  "result": {
    "data": {
	"id": "2133727",
	"published_at": "2023-01-10T06:37:56.000Z",
	...
	}
}

```


### Sample request(unpublish)
```js
request.delete(`https://{team_domain}.cupix.works/api/v1/panos/<your pano id>/publish`, {
    method: 'DELETE',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,published_at',
    },
    headers: {
    'x-cupix-auth' : <YOUR_API_KEY>
    }
})
```
### Sample response(unpublish)

```js
Status Code 200 : {
  "result": {
    "data": {
	"id": "2133727",
	"published_at": null,
	...
	}
}

```



