// src/pages/AddMemberPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberForm } from '../components/Members';
import { useMembers } from '../hooks'; // ✅ Add this import

const AddMemberPage = () => {
  const navigate = useNavigate();
  const { addMember } = useMembers(); // ✅ Now works

  const handleSave = async (data) => {
    await addMember(data);
    navigate('/members');
  };

  return (
    <div className="add-member-page">
      <h1>Add New Member</h1>
      <MemberForm
        isOpen={true}
        onClose={() => navigate('/members')}
        onSave={handleSave}
      />
    </div>
  );
};

export default AddMemberPage;