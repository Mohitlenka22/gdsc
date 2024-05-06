import React, { useEffect, useState } from 'react';
import Template from './Template';
import { useParams } from 'react-router-dom';
import axios from './axios';

const Reject = () => {
  const { member_id } = useParams();

  let [val, setVal] = useState('');

  const reject = async () => {
    try {
      console.log("reject")
      const res = await axios.delete(`/reject/${member_id}`);
      if (res.status === 204) {
        setVal("Thank You have Successfully Rejected to join Group");
      }
    } catch (err) {
      if (err.response.status === 404) {
        setVal('Member Not Found');
      } else {
        setVal('Something went wrong while adding..');
      }
    }
  };
  useEffect(() => {
    reject();
  },[]);
  return (
    <div>
      <Template text={val} approve={false} />
    </div>
  );
};

export default Reject;
