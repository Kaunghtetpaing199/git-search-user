import React from "react";
import styled from "styled-components";
import Followers from "./Followers";
import Card from "./Card";

const User = () => {
  return (
    <React.Fragment>
      <Wrapper>
        <Card />
        <Followers />
      </Wrapper>
    </React.Fragment>
  );
};
const Wrapper = styled.div`
  padding-top: 2rem;
  display: grid;
  gap: 3rem 2rem;
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  /* align-items: start; */
`;

export default User;
