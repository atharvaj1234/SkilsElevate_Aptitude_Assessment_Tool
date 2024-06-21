import React from "react";
import styled from "styled-components";
import "./loader.css";

const Loader = () => {
  return (
    <Loadder>
      <div className="loader"></div>
    </Loadder>
  );
};

export default Loader;

const Loadder = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  top: 0;
  z-index: 3;
`;
