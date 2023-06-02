import React, { useState, useEffect } from 'react';
import { readFileAsText, downloadFile } from './fileUtils';
import YAML from 'js-yaml';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [yamlData, setYamlData] = useState(null);
  const [formValues, setFormValues] = useState({
    blockCode: '',
    description: '',
    name: '',
    accountId: '',
    apiGatewayIds: [],
    lifecycle: '',
    schemaUrl: '',
    system: '',
    version: '',
    ownerId: '',
    producerEmail: '',
    gitlabLink: '',
    links: [],
    resources: [],  // add this line
  });
  const [selectedFileName, setSelectedFileName] = useState('');





  const [orderedFormValues, setOrderedFormValues] = useState({});

  useEffect(() => {
    const orderedData = {
      blockCode: formValues.blockCode,
      description: formValues.description,
      name: formValues.name,
      accountId: formValues.accountId,
      apiGatewayIds: formValues.apiGatewayIds,
      lifecycle: formValues.lifecycle,
      schemaUrl: formValues.schemaUrl,
      system: formValues.system,
      version: formValues.version,
      ownerId: formValues.ownerId,
      producerEmail: formValues.producerEmail,
      gitlabLink: formValues.gitlabLink,
      links: formValues.links,
      resources: formValues.resources,
    };

    setOrderedFormValues(orderedData);
  }, [formValues]);


  useEffect(() => {
    if (yamlData) {
      setFormValues(yamlData);
    }
  }, [yamlData]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const text = await readFileAsText(file);
    const data = YAML.load(text);

    if (!data.apiGatewayIds) {
      data.apiGatewayIds = [];
    }
    if (!data.links) {
      data.links = [];
    }

    setFile(file);
    setYamlData(data);
    setSelectedFileName(file.name); // Set the selected file name
  };


  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleArrayChange = (event, index, field) => {
    let newArr = [...formValues[field]];
    newArr[index] = event.target.value;
    setFormValues({
      ...formValues,
      [field]: newArr,
    });
  };

  const handleLinkChange = (event, index, subfield) => {
    let newArr = [...formValues.links];
    newArr[index][subfield] = event.target.value;
    setFormValues({
      ...formValues,
      links: newArr,
    });
  };

  const addField = (field) => {
    let newArr = [...formValues[field]];
    newArr.push(field === 'links' ? { url: '', title: '' } : '');
    setFormValues({
      ...formValues,
      [field]: newArr,
    });
  };

  const removeField = (index, field) => {
    let newArr = [...formValues[field]];
    newArr.splice(index, 1);
    setFormValues({
      ...formValues,
      [field]: newArr,
    });
  };

  const handleFileDownload = () => {
    const orderedData = {
      blockCode: formValues.blockCode,
      description: formValues.description,
      name: formValues.name,
      accountId: formValues.accountId,
      apiGatewayIds: formValues.apiGatewayIds,
      lifecycle: formValues.lifecycle,
      schemaUrl: formValues.schemaUrl,
      system: formValues.system,
      version: formValues.version,
      ownerId: formValues.ownerId,
      producerEmail: formValues.producerEmail,
      gitlabLink: formValues.gitlabLink,
      links: formValues.links,
      resources: formValues.resources,  // make sure to include this in your initial state
    };

    const filename = 'updated_' + file.name;
    downloadFile(YAML.dump(orderedData, { 'styles': { '!!str': 'double' } }), filename, 'text/yaml');
  };


  return (
    <div className="App">
      <div>
        <h1>YAML Editor</h1>
      </div>
      <div className="editor-container">
        <div className="inputs-container">
          <input type="file" accept=".yaml" onChange={handleFileUpload}  style={{padding:20}}/>
          {selectedFileName && <span>{selectedFileName}</span>}

          <form className="form">
            <label>
              Block Code:
              <input
                type="text"
                name="blockCode"
                value={formValues.blockCode}
                onChange={handleChange}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={formValues.description}
                onChange={handleChange}
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Account ID:
              <input
                type="text"
                name="accountId"
                value={formValues.accountId}
                onChange={handleChange}
              />
            </label>
            <label>
              Lifecycle:
              <input
                type="text"
                name="lifecycle"
                value={formValues.lifecycle}
                onChange={handleChange}
              />
            </label>
            <label>
              Schema URL:
              <input
                type="text"
                name="schemaUrl"
                value={formValues.schemaUrl}
                onChange={handleChange}
              />
            </label>
            <label>
              System:
              <input
                type="text"
                name="system"
                value={formValues.system}
                onChange={handleChange}
              />
            </label>
            <label>
              Version:
              <input
                type="text"
                name="version"
                value={formValues.version}
                onChange={handleChange}
              />
            </label>
            <label>
              Owner ID:
              <input
                type="text"
                name="ownerId"
                value={formValues.ownerId}
                onChange={handleChange}
              />
            </label>
            <label>
              Producer Email:
              <input
                type="text"
                name="producerEmail"
                value={formValues.producerEmail}
                onChange={handleChange}
              />
            </label>
            <label>
              Gitlab Link:
              <input
                type="text"
                name="gitlabLink"
                value={formValues.gitlabLink}
                onChange={handleChange}
              />
            </label>
            <label>
              API Gateway IDs:
              {formValues.apiGatewayIds.map((id, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    name={`apiGatewayId-${index}`}
                    value={id}
                    onChange={(event) => handleArrayChange(event, index, 'apiGatewayIds')}
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index, 'apiGatewayIds')}
                    style={{ marginLeft: '10px' }}
                  >
                    -
                  </button>
                </div>
              ))}
            </label>
            <button type="button" onClick={() => addField('apiGatewayIds')}>+</button>
            <label>
              Links:
              {formValues.links.map((link, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    name={`linkUrl-${index}`}
                    value={link.url}
                    placeholder="Url"
                    onChange={(event) => handleLinkChange(event, index, 'url')}
                  />
                  <input
                    type="text"
                    name={`linkTitle-${index}`}
                    value={link.title}
                    placeholder="Title"
                    onChange={(event) => handleLinkChange(event, index, 'title')}
                  />
                  <button type="button" onClick={() => removeField(index, 'links')} style={{ marginLeft: '10px' }}>-</button>
                </div>
              ))}
            </label>
            <button type="button" onClick={() => addField('links')}>+</button>
          </form>
          <button onClick={handleFileDownload}>Download Updated YAML</button>
        </div>
        <div className="yaml-viewer">
          <textarea className="editor__textarea" value={YAML.dump(orderedFormValues, { 'styles': { '!!str': 'double' } })} readOnly />

        </div>
      </div>
    </div>
  );
}

export default App;
