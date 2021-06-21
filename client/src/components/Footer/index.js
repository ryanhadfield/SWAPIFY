import React from "react";
import "materialize-css";
import { Footer } from "react-materialize";
import "./style.css";

const CustomFooter = (props) => {
  return (
    <div className="stickyFooter center">
      <Footer
      copyrights="&copy; 2021 Swapify">
      </Footer>
    </div>
  );
};

export default CustomFooter;
