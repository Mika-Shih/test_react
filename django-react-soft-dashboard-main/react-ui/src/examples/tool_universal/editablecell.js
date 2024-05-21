import React, { useEffect, useRef, useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import PropTypes from "prop-types";

const EditableTableCell = ({ index, value, onChange, className, style, keyName }) => {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState({});
  const indexRef = useRef(null);

  useEffect(() => {
    if (isEditing[indexRef.current] && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (index, keyName) => {
    indexRef.current = `${index}_${keyName}`;
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [`${index}_${keyName}`]: true,
    }));
  };

  const handleBlur = (index, keyName) => {
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [`${index}_${keyName}`]: false,
    }));
  };

  const handleKeyDown = (e, index, keyName) => {
    if (e.key === "Enter") {
      handleBlur(index, keyName);
    }
  };

  return (
    <TableCell key={index} className={className} onClick={handleDoubleClick(index, keyName)}>
      {isEditing[`${index}_${keyName}`] ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          style={style}
          onChange={onChange}
          onBlur={handleBlur(index, keyName)}
          onKeyDown={handleKeyDown(index, keyName)}
        />
      ) : (
        value
      )}
    </TableCell>
  );
};

EditableTableCell.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  keyName: PropTypes.string.isRequired,
};
export default EditableTableCell;
