# Upload capture with video and pano

This document outlines mixed-capture uploads.

The overall flow is like this.

1. [Create a new capture with material: "video-pano"](#create-video-pano-type-capture)
2. [Add "pts_unit": ms when creating video](#create-a-video-model-on-the-server)
3. [Add "timestamp" property when creating pano](#create-a-pano-model-on-the-server)
4. Upload video and pano(still image) file data
5. check_uploading for each video and pano
6. "upload_done" the created capture

1,2,3 are just developed by us, and 4,5,6 are exactly the same as the old process.
So I'll just explain 1,2,3.

## Create video-pano type capture

`POST https://{team_domain}.cupix.works/api/v1/captures`

First, create capture as video-pano type.

Put video-pano in the material property.

| Attribute         | Type            | Required | Description                       |
| :---------------- | :-------------- | :------- | :-------------------------------- |
| fields            | array of string | true     | id, name, level, material, record |
| creation_platform | string          | true     | web                               |
| material          | string          | true     | video, pano, **video-pano**       |
| level_id          | int             | true     | level id to upload                |
| record_id         | string          | true     | record id to upload               |
| name              | string          | true     | capture name                      |
| expected_quality  | string          | true     | capture name                      |

### Sample request

```
request.post(`https://{team_domain}.cupix.works/api/v1/captures`, {
    method: 'POST',
    Accept: 'application/json',
    json: true,
    qs: {
        fields: 'id, name',
        creation_platform: "web",
        material: 'video-pano',
        level_id: <level id to upload>,
        record_id: <record id to upload>,
        name: <capture name>
    },
    headers: {
        'x-cupix-auth': <your access_token>
    }
})
```

### Sample response

```
Status Code 200 : {
  "result": {
    "data": {
      "id": "71118",
      "type": "capture",
      "attributes": {
        "id": 71118,
        "name": "videopanotest"
      }
    }
  },
  "session": null
}
```

## Create a video model on the server

`POST https://{team_domain}.cupix.works/api/v1/videos`

If capture was created with video-pano, put something called **pts_unit** when creating a video.

**pts_unit** specifies the format in which the still image timestamp is received.
Currently only supported in milliseconds

| Attribute    | Type            | Required | Description                                          |
| :----------- | :-------------- | :------- | :--------------------------------------------------- |
| fields       | array of string | true     | id,name,state,resource_state,upload_url,**pts_unit** |
| name         | string          | true     | video file name                                      |
| capture_id   | int             | true     | ID of the capture to which the video belongs         |
| **pts_unit** | string          | false    | **ms**                                               |

### Sample request

```
request.post(`https://{team_domain}.cupix.works/api/v1/videos`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs : {
            fields: 'id,name,state'
            },
        body : {
            name: <video file name>,
            capture_id: <ID of the capture to which the video belongs>,
			pts_unit: 'ms'
        },
        headers: {
            'x-cupix-auth': <your access_token>
        }
    })
```

### Sample response

```
Status Code 200 : {
  "result": {
    "data": {
      "id": "35032",
      "type": "video",
      "attributes": {
        "id": 35032,
        "name": "testvideo.mp4",
        "state": "created"
      }
    }
  },
  "session": null
}
```

## Create a pano model on the server

`POST https://{team_domain}.cupix.works/api/v1/panos`

We now need to tell which timestamp on the video the image to embed exists.

**timestamp** is just the playback time(ms) of the 5fps video.

| Attribute     | Type            | Required | Description                                                                |
| :------------ | :-------------- | :------- | :------------------------------------------------------------------------- |
| fields        | array of string | true     | id,name,state,resource_state,**timestamp**                                 |
| name          | string          | true     | image file name                                                            |
| capture_id    | int             | true     | ID of the capture to which the pano belongs                                |
| **timestamp** | int             | false    | _The timestamp of the video where the image exists (in units of pts_unit)_ |

### Sample request

```
request.post(`https://{team_domain}.cupix.works/api/v1/panos`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs : {
            fields: 'id,name,state,resource_state,timestamp'
            },
        body : {
            name: <image file name>,
            capture_id: <ID of the capture to which the image belongs>,
	    timestamp: 3000
        },
        headers: {
            'x-cupix-auth': <your access_token>
        }
    })
```

### Sample response

```

Status Code 200 : {
  "result": {
    "data": {
      "id": "2065697",
      "type": "pano",
      "attributes": {
        "id": 2065697,
        "name": "stillimage.jpg",
        "state": "created",
        "resource_state": "created",
        "timestamp": 3000
      }
    }
  },
  "session": null
}

```
