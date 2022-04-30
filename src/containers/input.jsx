import React from 'react';

function Input(props) {

    return (
        <div class="form-group mb-2">
            <input
                type="text"
                class="form-control"
                id={props.id}
                name={props.id}
                placeholder={props.placeholder}
                value={props.value}
                readOnly={props.readOnly}
                onChange={(e) => props.onChange(e)}
            />
        </div>
    );

};

export default Input;
