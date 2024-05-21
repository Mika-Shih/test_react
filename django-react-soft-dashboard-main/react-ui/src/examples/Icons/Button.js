import React, { useState, useEffect, forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
const height = "2.2em";
const ovalButtonStyle = css`
  position: relative;
  background-color: #bbdefb;
  border: none;
  color: black;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  font-family: ${({ hasChinese }) => (hasChinese ? "微軟正黑體" : "Calibri, sans-serif")};
  padding: 0.5em 1em;
  display: inline-flex;
  align-items: center;
  overflow: visible;
  border-radius: 0;
  position: relative;
  margin-left: calc(${height} * 2 / 3);
  margin-right: calc(${height} * 2 / 3);
  margin-top: calc(${height} * 1 / 6);
  margin-bottom: calc(${height} * 1 / 6);
  height: ${height};

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: ${height};
    height: 100%;
    border-radius: 100%;
    background-color: #bbdefb;
  }

  &::before {
    left: calc(-${height} / 2); /* 負值設置在元素左側 */
  }

  &::after {
    right: calc(-${height} / 2); /* 負值設置在元素右側 */
  }
`;

const OvalButtonWrapper = styled.button`
  ${ovalButtonStyle}
  width: ${({ ovalWidth }) => ovalWidth};
  position: relative;
  span {
    z-index: 1;
  }
`;

const ButtonComponent = forwardRef(({ children, onClick }, ref) => {
  const [hasChinese, setHasChinese] = useState(false);
  const [ovalWidth, setOvalWidth] = useState("50%");
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      setOvalWidth(`calc(${textWidth}px + 2em)`);
    }

    // 檢查文字中是否包含中文
    setHasChinese(/[\u4e00-\u9fa5]/.test(children));
  }, [children, textRef]);

  return (
    <OvalButtonWrapper ref={ref} hasChinese={hasChinese} onClick={onClick} ovalWidth={ovalWidth}>
      <span ref={textRef} style={{ whiteSpace: "nowrap" }}>
        {children}
      </span>
    </OvalButtonWrapper>
  );
});

ButtonComponent.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func, // onClick PropTypes
};
ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;
