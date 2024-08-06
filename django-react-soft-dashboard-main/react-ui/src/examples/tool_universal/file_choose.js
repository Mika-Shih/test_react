import React from "react";
import Loading_option from "./loading_option";
import PropTypes from "prop-types";

export default function Asynchronous({ data, setData }) {
  return (
    <>
      <div>
        <Loading_option
          api="polls/file_location"
          name="file_name"
          request={{
            file_choose: data
              ? data
                  .filter((option) => option !== null)
                  .map((option) => option.value)
                  .filter((value) => value !== "")
              : [],
          }}
          selectedOptions={data ? data[data.length - 1] : null}
          setSelectedOptions={(newOptions) => setData(data ? [...data, newOptions] : [newOptions])}
        />
      </div>
    </>
  );
}

Asynchronous.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
};
