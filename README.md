# file-upload                                                                                          
express backend with a client to get a public url for an uploaded file

## usage
* `npm install` or `yarn install`
* `npm start` or `yarn start`
* set environment variables
* visit on `/` to get a [react client](frontend/src/) served through express 

## config
* environment variables
    * `PORT` - port to serve (default: 3000)
    * `MAX_FILE_UPLOAD_SIZE` - max size of file in MB that can be uploaded (default: 10)
    * `FILES_DIRNAME` - path to folder that exists to store uploaded files (default: 'files')

## api
### GET `/files`       
* return list of files with paths
 ```json 
[	
  {"path": "/file/some-id"},
  {"path": "/file/some-id"},
  {"path": "/file/some-id"},  
]
```

### POST `/files`       
* post data with `"Content-Type": "multipart/form-data"` and `form-data` with a key/id of `file`
* return path of uploaded file and size in bytes
```json 
  {
  	"path": "/file/some-id",
  	"size": "size-in-bytes",
  }  
```                     

### GET `/file/<id>`       
* gets the file with id

