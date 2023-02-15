import React from "react";
import PropTypes from "prop-types";

const UniversalFormModal = ({ show, handleClose, title, inputs }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {};
    for (let [name, value] of formData) {
      data[name] = value;
    }
    console.log(data);
  };

  return (
    <>
      {show && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClose}>
              &times;
            </span>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
              {inputs.map((input, index) => (
                <div key={index} className="form-group">
                  <label htmlFor={input.name}>{input.label}</label>
                  {input.type === "select" ? (
                    <select
                      className="form-control"
                      id={input.name}
                      name={input.name}
                    >
                      {input.options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="form-control"
                      type={input.type}
                      id={input.name}
                      name={input.name}
                      placeholder={input.placeholder}
                      required={input.required}
                    />
                  )}
                </div>
              ))}
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

UniversalFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default UniversalFormModal;