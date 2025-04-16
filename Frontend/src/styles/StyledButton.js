import styled from 'styled-components';

const StyledButton = styled.button`
  color: white;
  text-decoration: none;
  font-size: 25px;
  border: none;
  background: none;
  font-weight: 600;
  font-family: 'Poppins';

  &::before {
    margin-left: auto;
  }

  &::after, &::before {
    content: '';
    width: 0%;
    height: 2px;
    background: #f44336;
    display: block;
    transition: 0.5s;
  }

  &:hover::after, &:hover::before {
    width: 100%;
  }
`;

export default StyledButton;
