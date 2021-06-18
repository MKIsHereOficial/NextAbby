import React from 'react';

import styled from 'styled-components';

import colors from '../colors.config';
import styles from '../styles/Login.module.css';

const LoginButton: React.FC = () => {
    return (
        <a href="/api/auth/signin">
            <Button className={styles.login_btn}>Logue-me</Button>
        </a>
    )
}

const Button = styled.button`
  color: ${colors.SECONDARY};

  border: .75vh solid ${colors.PRIMARY}; 
  border-color: ${colors.PRIMARY} transparent transparent transparent;
  
  animation: onLoad 4s linear;

  @keyframes onLoad {
      from {
          left: -15vw;
          filter: blur(10px);
          opacity: 0;
          border-color: ${colors.PRIMARY} ${colors.PRIMARY} ${colors.PRIMARY} ${colors.PRIMARY};
          border-radius: 4vh;
          border-width: .45vh;
      }
  }

`;


export default LoginButton;