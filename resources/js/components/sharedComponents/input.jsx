import React from "react";

const Input = ({ name, type, label, value, onChange, error }) => {

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}: </label>

            <input
                type={type}
                className="form-control"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
            />

            { error && <div className="alert alert-danger">{error}</div> }
        </div>
    );
};

export default Input;
