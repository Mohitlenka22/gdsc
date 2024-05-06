import React, { useEffect, useState } from 'react';
import Template from './Template';
import axios from './axios';
import { useParams } from 'react-router-dom';

const Approve = () => {
  const { member_id, project_id } = useParams();
  let [val,setVal]=useState("");


  const approve = async () => {
    try {
      const res = await axios.post(`/approve/${member_id}/${project_id}`);
      if(res.status === 201){
        setVal("Wohoo ! You have already successfully added");
      }
    } catch (err) {
      if(err.response.status===412){
        setVal("Wohoo! Already added to team...!")
      }else{
        setVal("Something went wrong while adding..")
      }
    }
  };
  useEffect(() => {
    approve();
  },[]);
  return  <>
  <Template text={val} approve={true} />;
  </>
};

export default Approve;
