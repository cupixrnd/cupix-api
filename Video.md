

This document covers uploaded video resources. First, video is a child model of the capture model. So you should know the capture_id to query a video list. You can find the id, name, and state of the video by inputting capture_id in queryString.

Then you can download the original video files by inserting the video_id obtained this way into the download API.

Let's say there is a pair of video with capture_id 132435 of the insta360 One X2 camera, and each video_id is 1324 and 1325. you can search for two video models through `GET /videos` and then call the download API `GET /videos/{id}/download`with their IDs.


# Get a video list

`GET /videos`

> Code samples

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

r = requests.get('https://api.cupix.works/api/v1/videos', params={
  'fields': 'id, name, state',
  'capture_id' : 123456
}, headers = headers)

print(r.json())

```

<h3 id="video-list-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|fields|query|array[string]|true|id, name, state|
|capture_id|query|integer|false|Capture ID|


> Example responses

> 200 Response

```json
 {
  "result": {
    "data": [
      {
        "id": "1",
        "type": "video",
        "attributes": {
          "id": 1,
          "name": "VID_20231117_123456_00_038.insv",
          "state": "done"
        }
      },
      {
        "id": "2",
        "type": "video",
        "attributes": {
          "id": 2,
          "name": "VID_20231117_123456_10_038.insv",
          "state": "done"
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

<h3 id="video-list-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Video list|[VideoListResponse](#schemavideolistresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|


# Download the video


> Code samples

`GET /videos/{id}/download`

```python
import requests
headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

r = requests.get('https://api.cupix.works/api/v1/videos/{id}/download', headers = headers)

https.get(r.url, {fileStream})

```

<h3 id="video-download-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer(int64)|true|Video ID|

> Example responses

The URL of this API response contains a URL where you can download the video directly. Please use this to download the video.

> 400 Response

<h3 id="video-download-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Redirect to video download link|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad Request|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized request|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Permission denied|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Not found|None|
