const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const cryptoRandomString = require('crypto-random-string');

const PORT = process.env.PORT || 3000;
const MAX_FILE_UPLOAD_SIZE = process.env.MAX_FILE_UPLOAD_SIZE || 10;
const FILES_DIRNAME = process.env.FILES_DIRNAME || 'files';

const app = express();
app.use(cors());

app.use('/file', express.static(FILES_DIRNAME));
app.use(
  fileUpload({
    useTempFiles: true,
    limits: {
      fileSize: MAX_FILE_UPLOAD_SIZE * 1024 * 1024,
    },
  })
);

// serving react
app.use(express.static('frontend/build'));
app.use('/static', express.static('frontend/build/static'));
app.get('/', (req, res) => {
  res.sendFile('frontend/build/index.html');
});

app.get('/files', (req, res) => {
  const filesDir = path.join(__dirname, FILES_DIRNAME);
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let filesList = [];
      files.forEach((filename) => {
        filesList.push({
          path: `/file/${filename}`,
        });
      });
      res.json(filesList);
    }
  });
});

app.post('/files', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('no files were uploaded');
  }
  let file = req.files.file;
  const identifier = cryptoRandomString({ length: 10, type: 'url-safe' });
  const extension = file.name.slice(
    ((file.name.lastIndexOf('.') - 1) >>> 0) + 2
  );
  const filename = extension.length ? identifier + '.' + extension : identifier;
  file.mv(`${FILES_DIRNAME}/${identifier}.${extension}`, (err) => {
    if (err) return res.status(500).send(err);
    else {
      res.json({
        path: `/file/${filename}`,
        size: file.size,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
