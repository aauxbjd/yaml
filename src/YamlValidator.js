import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import yaml from 'js-yaml';

// Replace the templateData variable with your YAML template data
const templateData = {
  properties: {
    name: { type: 'string', required: true },
    age: { type: 'number', required: true },
    email: { type: 'string', required: false },
  },
};

// Convert the YAML template data to a Yup validation schema
const createValidationSchema = (template) => {
  const schemaProperties = Object.entries(template.properties).reduce(
    (properties, [key, { type, required }]) => {
      let field = Yup[type]();

      if (required) {
        field = field.required('Required field');
      }

      properties[key] = field;
      return properties;
    },
    {}
  );

  return Yup.object().shape(schemaProperties);
};

const YamlValidator = () => {
  const validationSchema = createValidationSchema(templateData);

  const formik = useFormik({
    initialValues: {
      yamlInput: '',
    },
    validationSchema,
    onSubmit: (values) => {
        try {
          const parsedYaml = yaml.safeLoad(values.yamlInput);
          
          // This line will throw an error if the parsed YAML is not valid according to the schema.
          // If the line completes without throwing an error, the YAML is valid.
          validationSchema.validateSync(parsedYaml);
          
          alert('YAML is valid!');
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            alert('YAML validation error: ' + error.errors.join(', '));
          } else {
            alert('YAML syntax error. Please check the input.');
          }
          console.error(error);
        }
      }
      
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <textarea
            id="yamlInput"
            name="yamlInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.yamlInput}
            rows={10}
            cols={50}
          />
        </div>
        <div>
          {formik.touched.yamlInput && formik.errors.yamlInput ? (
            <div>{formik.errors.yamlInput}</div>
          ) : null}
        </div>
        <div>
          <button type="submit">Validate</button>
        </div>
      </form>
    </div>
  );
};

export default YamlValidator;
