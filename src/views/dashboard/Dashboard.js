import React from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardFooter,
  CCol,
  CRow,
} from '@coreui/react'

import axios from 'axios'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'
import { jwtDecode } from "jwt-decode";
import { useContext , useEffect } from 'react'
import { Store } from 'src/views/forms/validation/store';
import base_url from 'src/base_url'
import Breadcrumbnav from '../breadcrum/Breadcrumbnav';
const Dashboard = () => {
  const [steps, setsteps] = useState('batch')
  const [Betchslug, setBetchslug] = useState("");
  const [semSlug, setsemSlug] = useState("");
  const [subSlug, setsubSlug] = useState("");
  const [batchCount, setbatchCount] = useState(0);
  const [semCount, setsemCount] = useState(0);
  const [subCount, setsubCount] = useState(0);  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken , profileDetails } = state  
  const decodeToken= () => {
    const decoded = jwtDecode(accessToken);
    ctxDispatch({ type: 'SET_PROFILE', payload: decoded.profile});
    console.log(decoded.profile);
    console.log(profileDetails);
    //setadminInfo(decoded)
  }
  useEffect(() => {  
    decodeToken()
    getObjectCounts()    
  }, []);
  const getObjectCounts = () =>{
    const header = {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning':true
    }
    axios.get(`${base_url}/manage/get_object_counts`,{headers:header})
    .then((response)=>{
        setbatchCount(response.data.batches)
        setsemCount(response.data.semesters)
        setsubCount(response.data.subjects)
    })
    .catch((error)=>{
      console.log(error.response);
    })
  }
  
  const chageSteps = (currentStep) =>{
      setsteps(currentStep)
  }
  const progressExample = [
    { title: 'Batches', value: batchCount, nextStep:'batch'},
    { title: 'Semester', value: semCount, nextStep:'semester' },
    { title: 'Subjects', value: subCount, nextStep:'subject' },
  ]

  return (
    <>
      <Breadcrumbnav currentStep={steps} chageSteps={chageSteps}></Breadcrumbnav>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <CButton style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => {chageSteps(item.nextStep)}}>
                  <div className="text-medium-emphasis">{item.title}</div>
                  <strong style={{ color: 'black' }}>
                    {item.value} {item.percent}
                  </strong>
                </CButton>
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      {(() => {
        
        switch (steps) {
          case 'batch':
            return <Validation chageSteps={chageSteps}  setSlug={setBetchslug} setBatchCout={setbatchCount}></Validation>
          case 'semester':
            return <FormControl chageSteps={chageSteps}  batchSlug={Betchslug} setsemSlug={setsemSlug}></FormControl>
          case 'subject':
            return <Select chageSteps={chageSteps} semSlug={semSlug} setsubSlug={setsubSlug}></Select>
          default:
            console.log(steps)
        }
      })()}
    </>
  )
}

export default Dashboard
