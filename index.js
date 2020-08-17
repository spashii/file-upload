const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const cryptoRandomString = require('crypto-random-string');

const app = express();

const PORT = process.env.PORT;

app.use('/file', express.static('static'));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get('/files', (req, res) => {
  const filesDir = path.join(__dirname, 'static');
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
  const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
  const filename = extension.length ? identifier+'.'+extension : identifier
  file.mv(`static/${identifier}.${extension}`, (err) => {
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
