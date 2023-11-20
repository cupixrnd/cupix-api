# Upload video without Capture App

This document explains how to do web-upload without capture data which is *waiting panos state* uploaded by the capture app.
In the case of web-upload, start point and scale after processing may be different because the start and end points of capture are unknown. Please note this.

The overall flow is as follows.

1. [Get authentication token with email and password.](https://github.com/RondoOp5/cupix-api-playground/blob/main/cupix-api/authenticate.md)
2. [Finding the key of the project you want to upload. Let's call this facility_key.](https://github.com/RondoOp5/cupix-api-playground/blob/main/cupix-api/facility.md)
3. [Finding the id of the level you want to upload. Let's call this level_id.](https://github.com/RondoOp5/cupix-api-playground/blob/main/cupix-api/level.md)
4. [Create an empty record. Let's call this record_id.](#create-an-empty-record)
5. [Create an empty capture with record_id and level_id.](#create-an-empty-capture)
6. [Create an empty video model with capture_id and get upload_url](#create-an-empty-video-model-with-capture_id-and-get-upload_url)
7. [Upload your video files to the upload url or upload using the aws sdk.](#upload-video-to-upload-url)
8. [Check whether the upload of the video file is successful.](#check-success-of-upload)
9. [Modify a state of the area which upload is complete.](#make-area-upload-done-state)





## Create an empty record
*Record* is the name that calls Capture of CupixWorks on the server. Conversely, the name that calls the area of Cupixworks is *capture*.
From now on, we will call each Capture, area of CupixWorks as *record*, *capture*.
Our first goal is to 1. create a capture, 2. upload video to that capture, and 3. trigger that capture to be calculated by notifying server that the upload is complete.
The whole series of steps after this is for this.

`POST https://api.cupix.works/api/v1/records`

| Attribute    | Type            | Required | Description                                                               |
|:----------|:----------|:----------|:----------|
| fields    | array of string   | true   | id,name,running_state,facility,workspace,user,team,meta,note,captured_at,created_at,updated_at,thumbnail_urls,permission,last_updated_user,editing_state   |
| facility_key    | string   | true    | the key of the project you want to upload  |
| captured_at  |string   | true    | ex) "2023-01-20T08:53:29.734Z"   |
| note  | string   | false    | Comments to display on record   |

### Sample request
```js
request.post(`https://api.cupix.works/api/v1/records`, {
    method: 'POST',
    Accept: 'application/json',
    json: true,
    qs : {
        fields : 'id, captured_at',
        facility_key : <your facility_key>,
        note : 'test',
        captured_at : new Date()
    }, 
    headers: {
    'x-cupix-auth' : <your access_token>
    }
    })
```

### Sample response
```js
Status Code 200 : {
  "result": {
    "data": {
      "id": "10200",
      "type": "record",
      "attributes": {
        "id": 10200,
        "captured_at": "2023-01-20T08:53:29.000Z"
      }
    }
  },
  "session": null
}

```

**Set the id received as a response here as *record_id* and save it.**


## Create an empty capture

`POST https://api.cupix.works/api/v1/captures`

| Attribute    | Type            | Required | Description                                                               |
|:----------|:----------|:----------|:----------|
| fields    | array of string   | true   | id,name,bucket,size,state,upload_state,running_state,error_code,processing_status,user,team,facility,workspace,thumbnail_urls,meta,created_at,updated_at,published_at,measure_ready_at,capture_type,level,record,permission,last_updated_user    |
| creation_platform   | string   | true    | Which platform the capture was made on ex) 'web'    |
| material   | string    | true    | What material to capture. either 'video' or 'pano'   |
|level_id| string    | true    | The id of the level you want to capture    |
|record_id   | string    | true    | The id of the record you want to capture    |
| name    | string    | true    | The name you want to write in the capture   |

### Sample request
```js
request.post(`https://api.cupix.works/api/v1/captures`, {
    method: 'POST',
    Accept: 'application/json',
    json: true,
    qs: {
        fields: 'id, upload_url',
        creation_platform: "web",
        material: 'video',
        level_id: <your level_id>,
        record_id: <your record_id>,
        name: 'test_create_area'
    },
    headers: {
        'x-cupix-auth': <your access_token>
    }
})
```

### Sample response
```js
Status Code 200 : {
  "result": {
    "data": {
      "id": "72493",
      "type": "capture",
      "attributes": {
        "id": 72493,
        "name": "test_create_area"
      }
    }
  },
  "session": null
}

```


**Set the id received as a response here as *capture_id* and save it.**



## Create an empty video model with capture_id and get upload_url

`POST https://api.cupix.works/api/v1/videos`

| Attribute    | Type            | Required | Description                                                               |
|:----------|:----------|:----------|:----------|
| fields    | array of string  | true  | **id,upload_url**,name,state,resource_state    |
| name   |string    | true   | true   | Name of the video file (Please be sure to write the file name.)
| capture_id   |string   | true    | your capture_id   |

### Sample request
```js
request.post(`https://api.cupix.works/api/v1/videos`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs : { 
            fields: 'id,upload_url'
            },
        body : {
            name: <your file_name ex) 'VID_20210503_095400_00_052'>,
            capture_id: <your capture_id>
        },
        headers: {
            'x-cupix-auth': access_token
        }
    })

```


### Sample response
```js
Status Code 200 : {
  "result": {
    "data": {
      "id": "36788",
      "type": "video",
      "attributes": {
        "id": 36788,
        "upload_url": <your upload_url>
      }
    }
  },
  "session": null
}
```


**Since there are two insv files, you may think that you need to call them twice. But you can upload two files together with one upload_url obtained by calling only once.**


<br>

## Upload video to upload url

Just upload the file to upload_url.
Uploads can be executed with a PUT request in any language.
The following is a sample code written in js.


### Sample request

```js
const streamUpload = (filType, fileSize, filePath, videoId, uploadUrl) => new Promise((resolve, reject) => {

    const uploadStream = request.put(uploadUrl, {headers: {"Content-Type" : filType, 'Content-Length' : fileSize, Accept: 'application/json'}} );
    const readStream = createReadStream(filePath
    //     , { highWaterMark : 2 * 1024 * 1024 }
        );
    readStream.pipe(uploadStream);
    uploadStream.on('complete', (res, body) => resolve(res));
    uploadStream.on('error', e => {
        try {
            uploadStream.resume();
        }
        catch {
            console.log(`uploadstreamerror : ${e}`);
            reject(e);
        }
    })
});
const size = await fs.stat(filePath).then(({size}) => size);
await streamUpload('insv', size, filePath, <Your_video_id>, <Your_upload_url>).then(console.log);
```


**If the size of one video you want to upload exceeds 5GB, you must use the aws sdk. Here's a guide.**


### Get upload credential

`POST https://api.cupix.works/api/v1/videos/{id}/upload_credentials`

| Attribute | Type            | Required | Description                                                                                                 |
| :-------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------- |
| fields    | array of string | true     | aws_access_key_id,aws_secret_access_key,aws_session_token,expires_at,basepath,bucket_name,bucket_region,acl |
| id        | integer         | true     | video id to upload                                                                                          |

One thing to note when uploading insta video is that the video ids of a pair of files are different, but the pair must be uploaded to the same address.

Therefore, POST upload credential request is required for only one of 32918 and 32919 of the example response above, and the credential is used to upload all a pair of files.

Let's say we upload the above a pair of files.

### Sample request

```js
request.post(`https://api.cupix.works/api/v1/videos/32918/upload_credentials`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs: {
            fields: 'aws_access_key_id,aws_secret_access_key,aws_session_token,expires_at,basepath,bucket_name,bucket_region,acl'
        },
        headers: {
            'x-cupix-auth': <your_access_token>
        }
    })
```

### Example response

```js
{
  "result": {
    "aws_access_key_id": "...",
    "aws_secret_access_key": "...",
    "aws_session_token": "...",
    "basepath": "resources/m6t0lz/apne2/v1",
    "bucket_name": "cupixworks-source-e7fe996f908a-apne2",
    "bucket_region": "ap-northeast-2",
    "expires_at": "...",
    "acl": "bucket-owner-full-control"
  },
  "session": null,
  "message": null
}

```

### import aws-sdk and upload video

Then, implement aws-sdk upload with the obtained information and upload it.(See [here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateMultipartUpload.html))

## Check success of upload

`PUT https://api.cupix.works/api/v1/videos/{id}/check_uploading`

| Attribute | Type            | Required | Description                                                                                                           |
| :-------- | :-------------- | :------- | :-------------------------------------------------------------------------------------------------------------------- |
| fields    | array of string | true     | uuid,ifc_guid,id,name,state,user,team,capture,facility,workspace,meta,thumbnail_urls,created_at,updated_at,upload_url |
| id        | integer         | true     | video id uploaded                                                                                                     |

The thing to note is that insta360 video is a pair, so you have to check_uploading for both files before next step.

### Sample request

```js
request.put(`https://api.cupix.works/api/v1/videos/32918/check_uploading`, {
    method: 'PUT',
    Accept: 'application/json',
    json: true,
    qs: {
        fields: 'id,name,state'
    },
    headers: {
        'x-cupix-auth': <your_access_token>
    }
})
```

### Example response

```js
{
  "result": {
    "data": {
      "id": "32918",
      "type": "video",
      "attributes": {
        "id": 32918,
        "name": "VID_20221104_145752_00_004.insv",
        "state": "done",
        }
    }
  },
  "session": null
}
```

## Make Area upload done state

`PUT https://api.cupix.works/api/v1/captures/{id}`

| Attribute    | Type            | Required | Description                                                                                                                                                                                                                                                 |
| :----------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fields       | array of string | true     | uuid,ifc_guid,id,name,bucket,size,state,upload_state,running_state,error_code,processing_status,user,team,facility,workspace,thumbnail_urls,meta,created_at,updated_at,published_at,measure_ready_at,capture_type,level,record,permission,last_updated_user |
| id           | integer         | false    | Area id                                                                                                                                                                                                                                                     |
| upload_state | string          | false    | upload_done                                                                                                                                                                                                                                                 |

It is time to use the capture id saved above.

Now let the server know that your upload is complete and you're done.

### Sample request

```js
request.put(`https://api.cupix.works/api/v1/captures/199991`, {
    method: 'PUT',
    Accept: 'application/json',
    json: true,
    qs: {
        fields: 'id,name,state,upload_state'
    },
    body: {
        upload_state: 'upload_done'
    },
    headers: {
        'x-cupix-auth': <your_access_token>
    }
}
);
```

### Example response

```js
{
  "result": {
    "data": {
      "id": "199991",
      "type": "capture",
      "attributes": {

        "id": 199991,
        "name": "Video [13:46:35]",
        "state": "queued",
        "upload_state": "upload_done",

      }
    }
  },
  "session": null
}
```
