# Upload video with metadata

This document covers how to upload videos which synced capture with the capture app.

The overall flow is as follows.

If the size of one video file you want to upload is less than 5 GB

1. [Get all ids and upload urls of videos that are in synced state.](#get-all-video-ids-and-upload_urls)
2. [Upload a video file to the upload url.](#upload-video-to-upload-url)
3. [Check whether the upload of the video file is successful.](#check-success-of-upload)
4. [Modify a state of the area which upload is complete.](#make-area-upload-done-state)

If the size of one video file you want to upload is larger than 5 GB

1. [Get all ids of videos that are in synced state.](#get-all-video-ids-and-upload_urls)
2. [Get upload credential information required to upload each video by aws s3 sdk.](#get-upload-credential)
3. [Upload a video file by importing aws s3 sdk based on the received information.](#import-aws-sdk-and-upload-video)
4. [Check whether the upload of the video file is successful.](#check-success-of-upload)
5. [Modify a state of the area which upload is complete.](#make-area-upload-done-state)

Before start, you need an authentication key. You can see an [in this document](https://github.com/RondoOp5/cupix-api-playground/blob/main/cupix-api/authenticate.md) to get access_token for _x-cupix-auth_ key.

## Get all video ids and upload_urls

First, to upload, you need to know the basic information required for upload and the video id on the server.
The required calls are:

`GET https://{team_domain}.cupix.works/api/v1/videos/upload_candidates`

| Attribute    | Type            | Required | Description                                                               |
| :----------- | :-------------- | :------- | :------------------------------------------------------------------------ |
| fields       | array of string | true     | id,name,workspace,facility,record,level,capture,resource_state,upload_url |
| workspace_id | integer         | false    | id to filter the video ids to upload by the workspace                     |
| page         | integer         | false    | page index to search per page                                             |
| per_page     | integer         | false    | Number of items to GET per page                                           |

You can get the upload_url by calling upload_url on fields.
But there is a important variable to keep in mind here. This is the id of the Area to which this video file belongs. The **id attribute of capture** of the response is the id of the Area. You should save this value and use it when the last upload is complete.

### Sample request

```js
request.get(`https://{team_domain}.cupix.works/api/v1/videos/upload_candidates`, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,name,workspace,facility,record,level,capture,resource_state,upload_url',
    },
    headers: {
    'x-cupix-auth' : <YOUR_API_KEY>
    }
})
```

### Example response

```js
{
  "data": [
    {
      "id": "32919",
      "type": "video",
      "attributes": {
        "id": 32919,
        "name": "VID_20221104_145752_10_004.insv",
        "workspace": {
                   },
          "updated_at": "2022-04-07T07:45:50.922Z",
          "billing_state": "none",
          "trial_state": "none",
          "lock_state": "active",
          "billing_info": {},
          "applied_billing_state": "active",
          "plan": null,
          "state": "active",
          "type": "Workspace"
        },
        "facility": {
        },
          "copy_state": "none",
          "bim_pack": false,
          "unit": {},
          "siteinsights_version": 2,
          "type": "Facility"
        },
        "record": {},
        "level": {},
        "capture": {
			"id" : 199991
		},
        "state": "created",
        "upload_url": ""
      }
    },
    {
      "id": "32918",
      "type": "video",
      "attributes": {
        "id": 32918,
        "name": "VID_20221104_145752_00_004.insv",
        "workspace": {
          "id": 761,
          "name": ",
          "facility_size": 0,
          "user": {},
          "updated_at": "",
          "billing_state": "none",
          "trial_state": "none",
          "lock_state": "active",
          "billing_info": {},
          "applied_billing_state": "active",
          "plan": null,
          "state": "active",
          "type": "Workspace"
        },
        "facility": {
          "id": 2764,
          "name": "",
          "key": "",
          "bearing": 0,
          "cycle_state": "created",
          "address": "",
          "use_georeference": true,
          "location": { },
          "copy_state": "none",
          "bim_pack": false,
          "unit": {},
          "siteinsights_version": 2,
          "type": "Facility"
        },
        "level": {},
        "capture": {
			"id" : 199991
		},
        "state": "created",
        "upload_url": ""
      }
    },

...
]
```

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

## Get upload credential

`POST https://{team_domain}.cupix.works/api/v1/videos/{id}/upload_credentials`

| Attribute | Type            | Required | Description                                                                                                 |
| :-------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------- |
| fields    | array of string | true     | aws_access_key_id,aws_secret_access_key,aws_session_token,expires_at,basepath,bucket_name,bucket_region,acl |
| id        | integer         | true     | video id to upload                                                                                          |

One thing to note when uploading insta video is that the video ids of a pair of files are different, but the pair must be uploaded to the same address.

Therefore, POST upload credential request is required for only one of 32918 and 32919 of the example response above, and the credential is used to upload all a pair of files.

Let's say we upload the above a pair of files.

### Sample request

```js
request.post(`https://{team_domain}.cupix.works/api/v1/videos/32918/upload_credentials`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs: {
            fields: 'aws_access_key_id,aws_secret_access_key,aws_session_token,expires_at,basepath,bucket_name,bucket_region,acl'
        },
        headers: {
            'x-cupix-auth': <YOUR_API_KEY>
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

#### import aws-sdk and upload video

Then, implement aws-sdk upload with the obtained information and upload it.(See [here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateMultipartUpload.html))

## Check success of upload

`PUT https://{team_domain}.cupix.works/api/v1/videos/{id}/check_uploading`

| Attribute | Type            | Required | Description                                                                                                           |
| :-------- | :-------------- | :------- | :-------------------------------------------------------------------------------------------------------------------- |
| fields    | array of string | true     | uuid,ifc_guid,id,name,state,user,team,capture,facility,workspace,meta,thumbnail_urls,created_at,updated_at,upload_url |
| id        | integer         | true     | video id uploaded                                                                                                     |

The thing to note is that insta360 video is a pair, so you have to check_uploading for both files before next step.

### Sample request

```js
request.put(`https://{team_domain}.cupix.works/api/v1/videos/32918/check_uploading`, {
    method: 'PUT',
    Accept: 'application/json',
    json: true,
    qs: {
        fields: 'id,name,state'
    },
    headers: {
        'x-cupix-auth': <YOUR_API_KEY>
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

`PUT https://{team_domain}.cupix.works/api/v1/captures/{id}`

| Attribute    | Type            | Required | Description                                                                                                                                                                                                                                                 |
| :----------- | :-------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fields       | array of string | true     | uuid,ifc_guid,id,name,bucket,size,state,upload_state,running_state,error_code,processing_status,user,team,facility,workspace,thumbnail_urls,meta,created_at,updated_at,published_at,measure_ready_at,capture_type,level,record,permission,last_updated_user |
| id           | integer         | false    | Area id                                                                                                                                                                                                                                                     |
| upload_state | string          | false    | upload_done                                                                                                                                                                                                                                                 |

It is time to use the capture id saved above.

Now let the server know that your upload is complete and you're done.

### Sample request

```js
request.put(`https://{team_domain}.cupix.works/api/v1/captures/199991`, {
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
        'x-cupix-auth': <YOUR_API_KEY>
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
