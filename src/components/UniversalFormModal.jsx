import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import Select from "react-select";

function DynamicForm({ show, name, handleClose, fields, data, onSuccess, url, formType, showConfirmation, setShowConfirmation }) {

  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  console.log(formData);

  useEffect(() => {
    setFormData(data || {});
    setErrors({});
  }, [data]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      Object.keys(formData).forEach((key) => {
        if (formData[key] && formData[key].label) {
          formData[key] = formData[key].value;
        }
      });

      if (!data.id) {
        const result = await axiosClient.post(url, formData);
        console.log(result);
        setNotification("Успешно добавлено");
      } else {
        await axiosClient.put(url + formData.id, formData);
        setNotification("Успешно обновлено");
      }

  
      const newFormData = Object.fromEntries(Object.entries(formData).map(([key, _]) => [key, null]));
      setFormData(newFormData);
  
      onSuccess();
      handleClose();
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
    }
  };
  
  
  const getParent = (id, data) => {
    const object = data.find((item) => item.id === id);

    if (object) {
      return { label: object.name || object.title, value: object.id };
    }
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(url + formData.id);
      onSuccess();
      handleClose();
      setShowConfirmation(false); // close confirmation modal
      setNotification("Успешно удалено");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    const fieldPrefix = fieldName.split('_')[0];
    // remove fieldPrefix from formData
    if (formData[fieldPrefix]) {
      delete formData[fieldPrefix];
    }
    setFormData({
      ...formData,   
      [`${fieldPrefix}_id`]: selectedOption
    });
  };

  const renderChildren = (options) => {
    options = options.map((option) => {
      const children = getAllChildren(option);
      return { ...option, childrens: children };
    });
    return options.map((option) => {
      return {
        label: option.name ?? option.title,
        value: option.id,
      };
    });
  };
  
  
  const getAllChildren = (object, allChildren = []) => {
    object.childrens?.forEach((child) => {
      allChildren.push(child);
      getAllChildren(child, allChildren);
    });
    return allChildren;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: [] });
  };


  // debugger;
  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <Form.Group key={field.name} controlId={field.name}>
          <Form.Label>{field.label}</Form.Label>
          <Select
            name={field.name}
            options={renderChildren(field.options)}
            onChange={(selectedOption) =>
              handleSelectChange(selectedOption, field.name)
              } 
            value={
              {
                label: formData[(field.name).split('_')[0]]?.name || formData[(field.name).split('_')[0]]?.title || formData[(field.name)]?.label,
                value: formData[field.name]?.id,
              }
            }
          />

            {errors[field.name] &&
              errors[field.name].length > 0 &&
              errors[field.name].map((error, index) => (
                <Form.Text key={index} className="text-danger">
                  {error}
                </Form.Text>
            ))}
        </Form.Group>
        
        );
      default:
        return (
          <Form.Group key={field.name} controlId={field.name} >
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type || "text"}
              name={field.name}
              autoFocus={field.name === fields[0].name}
              value={formData[field.name]
              }
              onChange={handleChange}
              
            />
            {errors[field.name] &&
              errors[field.name].length > 0 &&
              errors[field.name].map((error, index) => (
                <Form.Text key={index} className="text-danger">
                  {error}
                </Form.Text>
              ))}
          </Form.Group>
        );
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {fields.map((field) => renderField(field))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {formType === "edit" && (
            <Button variant="danger" onClick={() => setShowConfirmation(true)}>
              Удалить
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleDelete={handleDelete}
        name={data.name || data.title}
        url={url}
        id={data.id}
      />
    </>
  );
};

export default DynamicForm;