import React from "react";
import styled from "styled-components";

const PageNotFound = () => {
  const Div = styled.div`
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
  `;

  const TextHolder = styled.p`
      font-size: 25px;
    line-height: 5px;
  animation: fadeInDown 4.7s ease-out forwards;

  @keyframes fadeInDown {
  0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    80% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  `;

  const OppsText = styled.p`
  font-size: 60px;
  font-family: "Acme", sans-serif;
  font-weight: 400;
  line-height: 5px;
  animation: Opps 4.5s ease-out forwards;

  @keyframes Opps {
  0% {
      opacity: 0;
      font-size: 0px;
      transform: translateY(-20px);
    }
    80% {
      opacity: 0;
      font-size: 0px;
      transform: translateY(-20px);
    }
    
    90% {
      opacity: 1;
      font-size: 70px;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      font-size: 60px;
      transform: translateY(0);
    }
  }
  `;


  const ImageDiv = styled.img`
    mix-blend-mode: multiply;
  `;
  return (
    <>
      <Div>
        <ImageDiv src="https://i.pinimg.com/originals/0e/c0/db/0ec0dbf1e9a008acb9955d3246970e15.gif" />
        <OppsText>OOPS!</OppsText><TextHolder>Page Not Found</TextHolder>
      </Div>
    </>
  );
};

export default PageNotFound;
