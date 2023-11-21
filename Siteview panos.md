# Get lat, lon by querying panos by date in SV

If you open our SV, you can see the calculated lat and lon coordinates, but you need to calculate them yourself if you want to use the REST API to find them.

The workflow is as follows.

1. [Get the Project Geocoordinate by using the Project key.](https://github.com/RondoOp5/cupix-api-playground/blob/main/cupix-api/facility.md#get-georeference-information-of-a-certain-facility)
2. [Receive a list of pano by date of SV.](#get-pano-location-information-in-sv)
3. [Calculate lat, lon using Haversine formula.](#calculate-lat-lon-using-haversine-formula)

## Get pano location information in SV

`GET https://api.cupix.works/api/v1/reviews/{review_key}/records`

Through this call, you can get the date of Capture (called a record in server terminology), which means a collection of Cupix areas, and geo_coordinate_url, which is a url to download a json file containing the location information of all panos in that record.

| Attribute | Type            | Required | Description                                                                                             |
| :-------- | :-------------- | :------- | :------------------------------------------------------------------------------------------------------ |
| fields    | array of string | true     | id,**geo_coordinate_url**,facility,permission,meta,name,created_at,updated_at,**captured_at**,user,note |
| from_at   | string          | false    | ex) 2023-01-10T15:00:00.000Z                                                                            |
| to_at     | string          | false    | ex) 2023-01-12T14:59:59.999Z                                                                            |
| page      | integer         | false    | page index to search per page                                                                           |
| per_page  | integer         | false    | Number of items to GET per page                                                                         |

### Sample request

```js
request.get(`https://api.cupix.works/api/v1/reviews/<your siteview key>/records`, {
    method:'GET',
    Accept: 'application/json',
    json: true,
    qs : {
            fields : 'id,captured_at,geo_coordinate_url'
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
        "id": "10097",
        "type": "record",
        "attributes": {
          "id": 10097,
          "captured_at": "2023-01-10T03:00:00.000Z",
          "geo_coordinate_url": "https://d1.stage.cupix.works/fd8f7e34dd414077/record_geo_coordinate/apne2/7sh.json?1672811294"
        }
      }
    ],
    "pagination": {
      "total_entries": 1,
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

### Calculate lat, lon using Haversine formula

**First of all, before converting, make sure that the EPSG of your Project Geocoordinate is using the 4326 coordinate system. If not, another conversion is required.**
If you open geo_coordinate_url, it looks like this.

#### geo_coordinate_url.json

```js
{
  "panos": [
    {
      "id": 2130773,
      "pano_type": null,
      "capture": {
        "id": 71713,
        "measure_ready_at": null,
        "level": { "id": 9724 },
        "creation_platform": "app",
        "material": "video",
        "method": "timelaps"
      },
      "geo_coordinate": {
        "pos": [2.59444, 1.43676, 1.85181],
        "quat": [-0.05542, -0.04395, -0.76434, 0.64092]
      },
      "revision_type": "normal",
      "georeference": null,
      "use_georeference": false
    },
    {
      "id": 2130774,
      "pano_type": null,
      "capture": {
        "id": 71713,
        "measure_ready_at": null,
        "level": { "id": 9724 },
        "creation_platform": "app",
        "material": "video",
        "method": "timelaps"
      },
      "geo_coordinate": {
        "pos": [-226527.01355, 432533.01066, 4289.75294],
        "quat": [-0.05618, -0.04373, -0.76419, 0.64105]
      },
      "revision_type": "normal",
      "georeference": null,
      "use_georeference": false
    },
	...
   ]
}
```

Each pano's geo_coordinate.pos is the pano's x, y, z information, and x, y are needed to calculate lat and lon.
Since these x, y are relative coordinates[meter] to (lat, lon) of the Project Geocoordinate, they cannot be converted directly to lat, lon.
Therefore, it is necessary to write a function to be converted. The function might look like this.

```js
function(project_lat, project_lon, project_bearing, pano_x, pano_y) {

	...any implementations...

	return [abs_lat, abs_lon]
}
```

The conversion formula uses the Haversine formula, and if you want to implement it yourself, please refer to [this link](https://en.wikipedia.org/wiki/Haversine_formula) for implementation.

You can also implement the corresponding function using [Turf library](https://turfjs.org/docs/#destination). But a conversion process is required to use this library. Convert and put the input like this.

```
turf.destination(origin, distance, bearing, option) => pano_location:[lat, lon]
// origin : {lat, lon} of Project Geocoordinate obtained from Get facility
// distance : distance of (0, 0) ~ (pano_x, pano_y) [meter] pano_x, pano_y are obtained from geo_coordinate_url.json
// bearing : Bearing obtained from Get facility, it means clockwise rotation angle relative to true north direction of base bearing + position
```
