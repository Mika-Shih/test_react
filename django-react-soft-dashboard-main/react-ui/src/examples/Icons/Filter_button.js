import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const ButtonComponent = forwardRef(({ options, onClick }) => {
  const handleClick = (clickedOption) => {
    const newOptions = options.filter((option) => option !== clickedOption);
    onClick(newOptions);
  };
  return (
    <>
      {options &&
        options
          .filter((option) => option)
          .map((option, index) => (
            <Button key={index} onClick={() => handleClick(option)}>
              {option}
            </Button>
            //  style={{ whiteSpace: "nowrap", lineHeight: "1", textAlign: "center" }}
          ))}
    </>
  );
});

ButtonComponent.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func.isRequired,
};

ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;
