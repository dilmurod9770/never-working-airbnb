import styled from 'styled-components';

const StyleHomePage = styled.div`
  background-color: white;
  padding: 40px;
  display: flex;
  flex-direction: row;


  @media (max-width: 600px) {
    .header {
    padding: 20px;
    flex-direction: column;
    background-color: lightgray }
  }
`;

export default StyleHomePage;
