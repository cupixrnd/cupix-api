# Level

You need to query level info or create a level to upload a capture.
The only level information required when uploading a capture is a level id to upload to. You need to make a request to access id of the level you want to upload.

## Look up entire levels in the facility

`GET https://api.cupix.works/api/v1/levels`

| Attribute    | Type           | Required | Description                                                                                                                      |
| :----------- | :------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------- |
| fields       | array of sting | true     | id,name,state,user,team,workspace,facility,meta,created_at,updated_at,is_ground_level,elevation,ceiling_height,default_floorplan |
| facility_key | string         | false    | key of facility to search for level                                                                                              |
| page         | integer        | false    | page index to search per page                                                                                                    |
| per_page     | integer        | false    | Number of items to GET per page                                                                                                  |

### Sample request

```js
request.get(`https://api.cupix.works/api/v1/levels`, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
        fields : 'id,name,state,floorplans_count,default_floorplan',
        facility_key : <your_facility_key>
    },
    headers: {
    'x-cupix-auth' : <your_access_token>
    }
})
```

### Sample response

```js
Status Code 200 : {
  "result": {
    "data": [
      {
        "id": "30333",
        "type": "level",
        "attributes": {
          "id": 30333,
          "name": "leveltest1",
          "state": "created",
          "floorplans_count": 0
        }
      },
      {
        "id": "30332",
        "type": "level",
        "attributes": {
          "id": 30332,
          "name": "leveltest2",
          "state": "created",
          "floorplans_count": 0
        }
      },
      {
        "id": "30331",
        "type": "level",
        "attributes": {
          "id": 30331,
          "name": "leveltest3",
          "state": "created",
          "floorplans_count": 0
        }
      },
    ],
    "pagination": {
      "total_entries": 3,
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

<br>

### Create level

`POST https://api.cupix.works/api/v1/levels`

| Attribute    | Type            | Required | Description                                                                                                                      |
| :----------- | :-------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------- |
| fields       | array of string | true     | id,name,state,user,team,workspace,facility,meta,created_at,updated_at,is_ground_level,elevation,ceiling_height,default_floorplan |
| facility_key | string          | false    | key of facility where a level is created                                                                                         |
| elevation    | number          | false    | elevation(meter) of the level which be created                                                                                   |
| name         | string          | false    | name of the level which be created                                                                                               |

### Sample request

```js
request.post(`https://api.cupix.works/api/v1/levels`, {
        method: 'POST',
        Accept: 'application/json',
        json: true,
        qs: {
            fields: 'id,name,state,floorplans_count,default_floorplan',
            'facility_key': <your_facility_key>,
            elevation: 2,
            name: test
        },
        headers: {
            'x-cupix-auth': access_token
        }
    })
```

### Example response

```js
Status Code 200 : {
  "result": {
    "data": {
      "id": "30335",
      "type": "level",
      "attributes": {
        "id": 30335,
        "name": "test",
        "state": "created",
        "floorplans_count": 0
      }
    }
  },
  "session": null
}
```
