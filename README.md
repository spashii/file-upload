# file-upload-server                                                                                          
express backend to get a public url for an uploaded file
                                                                     
* ### GET `/files`       
* return list of files with paths
> ```json 
> [	
>   {"path": "/file/some-id"},
>   {"path": "/file/some-id"},
>   {"path": "/file/some-id"},  
> ]
> ```

* ### POST `/files`       
* post data with `"Content-Type": "multipart/form-data"` and `form-data` with a key/id of `file`
* return path of uploaded file and size in bytes
> ```json 
>   {
>   	"path": "/file/some-id",
>   	"size": "size-in-bytes",
>   }  
> ```                     

* ### GET `/file/<id>`       
* gets the file with id
