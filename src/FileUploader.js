import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import yaml from 'js-yaml';

const FileUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContents = reader.result;
        const yamlData = yaml.load(fileContents);
        setUploadedFiles((prevUploadedFiles) => [
          ...prevUploadedFiles,
          { name: file.name, data: yamlData },
        ]);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div>
      <h2>Upload YAML Files</h2>
      <Dropzone onDrop={handleFileUpload} multiple={true} accept=".yaml, .yml">
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <button>Drag and drop some files here, or click to select files</button> 
          </div>
        )}
      </Dropzone>
      {uploadedFiles.map((file, index) => (
        <div key={index}>
          <h3>{file.name}</h3>
          <pre>{JSON.stringify(file.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default FileUploader;
