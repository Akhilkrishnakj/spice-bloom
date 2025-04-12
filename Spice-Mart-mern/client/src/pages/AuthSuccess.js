import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components';

const SuccessContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6ffe6 0%, #f0fff0 100%);
`;

const SuccessCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const IconWrapper = styled(motion.div)`
  svg {
    font-size: 4rem;
    color: #10b981;
    filter: drop-shadow(0 4px 6px rgba(16, 185, 129, 0.2));
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1rem 0 0.5rem;
`;

const Message = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
`;

const RedirectText = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.75rem;
`;

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <SuccessContainer>
      <SuccessCard
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <IconWrapper
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <FaCheckCircle />
        </IconWrapper>
        <Title>Success!</Title>
        <Message>Your action was completed successfully</Message>
        <ProgressBarContainer>
          <ProgressBar
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </ProgressBarContainer>
        <RedirectText>Redirecting to home page...</RedirectText>
      </SuccessCard>
    </SuccessContainer>
  );
};

export default AuthSuccess;