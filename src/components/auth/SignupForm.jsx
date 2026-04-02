// Replacing old signup form with the wrapper for the new MultiStep one
import React from 'react';
import MultiStepSignupForm from './MultiStepSignupForm';

const SignupForm = ({ onSignupSuccess, setView }) => {
  return (
    <div className="w-full">
      <MultiStepSignupForm setView={setView} onSignupSuccess={onSignupSuccess} />
    </div>
  );
};

export default SignupForm;