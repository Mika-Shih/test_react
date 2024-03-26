import React from "react";
import PropTypes from "prop-types";
import { BeatLoader } from "react-spinners";

const Loading = ({ loading }) => {
  const styles = {
    loading: {
      position: "fixed",
      right: 0,
      left: 0,
      bottom: 0,
      top: 0,
      backgroundColor: "rgba(0, 0, 0, .65)",
      backdropFilter: "blur(5px)",
      zIndex: 9999,
      justifyContent: "center",
      alignItems: "center",
      display: loading ? "flex" : "none",
    },
  };

  return (
    <div style={styles.loading}>
      <BeatLoader color="white" loading={loading} />
    </div>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loading;
