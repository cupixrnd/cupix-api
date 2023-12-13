
# Introduction


As explained in the Pointcloud model, pointclouds whose kind is group do not have any files, so you should know the id of the pointcloud whose kind is sub.
 <br>
Also, you can check the *mesh_uploaded_at* and *ply_uploaded_at* fields of the *[Pointcloud model](https://github.com/cupixrnd/cupix-api/blob/main/Pointcloud.md#parameters)* to check whether the mesh or ply of the cpc exists.
<br>
<br>


## Download ply and mesh of the pointcloud

`GET /pointclouds/{id}/resources/{kind}/download`
<a id="opIdpointcloud_download_pointcloud_resource"></a>

> Code samples

```python
import requests
import zipfile

headers = {
  'Accept': 'application/json',
  'X-CUPIX-AUTH': <Your API Token>
}

# If the kind of the resource you want is mesh,
# you need to unzip it and extract the mesh ply file, since the downloaded file is a zip file.
r = requests.get('https://{team_domain}.cupix.works/api/v1/pointclouds/{id}/resources/mesh/download', headers = headers)
file_name = r.headers['Content-Disposition'].split('filename=')[1]
file_path  = f'<your_directory>/{file_name}'
with open(file_path, 'wb') as f:
    for chunk in r.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
with zipfile.ZipFile(file_path, 'r') as zip_ref:
    zip_ref.extractall(<directory to unzip>)

# If the kind of the resource you want is ply,
r = requests.get('https://{team_domain}.cupix.works/api/v1/pointclouds/{id}/resources/ply/download', headers = headers)
file_name = r.headers['Content-Disposition'].split('filename=')[1]
file_path  = f'<your_directory>/{file_name}'
with open(file_path, 'wb') as f:
    for chunk in r.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)



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


