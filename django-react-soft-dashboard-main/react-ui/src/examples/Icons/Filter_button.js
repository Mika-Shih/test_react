import React, { useState, useEffect, forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const height = "2.2em";

const ovalButtonStyle = css`
  position: relative;
  background-color: #d6e1d7;
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
    background-color: #d6e1d7;
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

const ButtonComponent = forwardRef(({ options, onClick }, ref) => {
  const [hasChinese, setHasChinese] = useState(false);
  const [ovalWidth, setOvalWidth] = useState("50%");
  const textRef = useRef(null);

  useEffect(() => {
    if (options) {
      let maxWidth = 0;
      options.forEach((option) => {
        const optionWidth = getTextWidth(option);
        if (optionWidth > maxWidth) {
          maxWidth = optionWidth;
        }
      });
      setOvalWidth(`calc(${maxWidth}px + 2em)`);

      // 檢查文字中是否包含中文
      setHasChinese(options.some((option) => option && /[\u4e00-\u9fa5]/.test(option)));
    }
  }, [options]); // 更新 options 时重新执行 useEffect

  const getTextWidth = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "inherit";
    return context.measureText(text).width;
  };

  return (
    <>
      {options &&
        options
          .filter((option) => option)
          .map((option, index) => (
            <OvalButtonWrapper
              key={index}
              ref={ref}
              hasChinese={hasChinese}
              onClick={() => onClick(option)}
              ovalWidth={ovalWidth}
            >
              <span
                ref={textRef}
                style={{ whiteSpace: "nowrap", lineHeight: "1", textAlign: "center" }}
              >
                {option}
              </span>
            </OvalButtonWrapper>
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
