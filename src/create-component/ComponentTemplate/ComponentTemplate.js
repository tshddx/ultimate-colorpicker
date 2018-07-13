import React from "react";
import { PropTypes } from "prop-types";
import classnames from "classnames";
import makeBem from "../../utils/makeBem";
import "./ComponentTemplate.css";

const bem = makeBem("ComponentTemplate");

const ComponentTemplate = ({ children }) => {
  return (
    <div className={classnames(bem())}>
      ComponentTemplate:
      {children}
    </div>
  );
};

ComponentTemplate.propTypes = {
  children: PropTypes.node
};

ComponentTemplate.defaultProps = {};

export default ComponentTemplate;
