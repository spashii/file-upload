import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [baseUrlSaved, setBaseUrlSaved] = useState(false);
  const [baseUrl, setBaseUrl] = useState(() => {
    try {
      const item = localStorage.getItem('baseUrl');
      setBaseUrlSaved(true);
      return item ? item : '';
    } catch (err) {
      console.log(err);
      return '';
    }
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultPath, setResultPath] = useState('');
  const [waiting, setWaiting] = useState(false);

  const onBaseUrlChange = (event) => {
    setBaseUrl(event.target.value);
    setBaseUrlSaved(false);
  };

  const onBaseUrlSave = () => {
    localStorage.setItem('baseUrl', baseUrl);
    setBaseUrlSaved(true);
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    setWaiting(true);
    let data = new FormData();
    data.append('file', selectedFile);
    axios
      .post(`${baseUrl}/files`, data)
      .then((res) => {
        console.log(res);
        setWaiting(false);
        setResultPath(baseUrl + res.data.path);
      })
      .catch((err) => {
        console.log(err);
        setWaiting(false);
        setResultPath('#there-was-an-error-pls-check-console');
      });
    setSelectedFile(null);
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="navbar-brand"> file upload </div>
      </nav>
      <div className="container-fluid">
        <div className="row justify-content-start p-3 m-4 shadow-sm bg-white">
          <div className="col-md-8">
            {resultPath ? (
              <div className="pb-2 mb-4 border-bottom">
                <a target="_blank" rel="noopener noreferrer" href={resultPath}>
                  {resultPath}
                </a>
              </div>
            ) : (
              <></>
            )}
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={baseUrl ? baseUrl : ''}
                placeholder="Server Base URL? ex: http://localhost:3000"
                onChange={onBaseUrlChange}
              />
              <button
                className="btn btn-success"
                onClick={onBaseUrlSave}
                disabled={baseUrl ? false : true}
              >
                Save
              </button>
            </div>
            <p className="text-muted pb-2 mb-2 border-bottom">
              Sending files to {baseUrl + '/files'} |{' '}
              {baseUrlSaved ? (
                <span className="text-success">Saved</span>
              ) : (
                <span className="text-danger">Not saved</span>
              )}
            </p>

            {baseUrl && baseUrlSaved ? (
              <div>
                <div className="pt-3 input-group">
                  {!waiting ? (
                    <>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          name="file"
                          onChange={onFileChange}
                        />
                        <label className="custom-file-label" htmlFor="file">
                          {selectedFile ? selectedFile.name : 'Choose File'}
                        </label>
                      </div>
                      <div className="input-group-append">
                        <button
                          className="btn btn-primary"
                          disabled={selectedFile ? false : true}
                          onClick={onFileUpload}
                        >
                          Upload
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>Uploading...</p>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
