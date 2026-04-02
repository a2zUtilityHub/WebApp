import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SupportTicketDetail from '@/components/support/SupportTicketDetail';
import { Helmet } from 'react-helmet';

// This is a wrapper page component for direct linking /support/ticket/:id
const SupportTicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/support');
  };

  return (
    <>
      <Helmet>
        <title>Ticket #{id} - Support | a2z Utility Hub</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
         <SupportTicketDetail ticketId={id} onBack={handleBack} />
      </div>
    </>
  );
};

export default SupportTicketDetailPage;