import React from "react";
import { useState } from "react";
import { useContext } from "react";
import axios from 'axios';
import "./otp.scss";
import styles from "./auth.module.scss";
import Card from '../../components/card/Card';
import loaderImage from "../../assets/login.png";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

 function OTPInput() {
  

    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/reset-password';
    
    const location = useLocation();
    const navigate = useNavigate();
    
const data = location?.state?.data;
 const {id, otp, email} = data
  const [timerCount, setTimer] = React.useState(60);
  const [OTPinput, setOTPinput] = useState(new Array(4).fill(""));
  
  const [disable, setDisable] = useState(true);

//   console.log(otp);
//   console.log(email);
//   console.log(parseInt(OTPinput).join(""));

  function handleChange(e, index){
    if(isNaN(e.target.value)) return false
    setOTPinput([...OTPinput.map((data, i) => i === index ? e.target.value : data)])


    if(e.target.value && e.target.nextSibling){
        e.target.nextSibling.focus();
    }
  }

  function handlePaste(e, index){
    const value = e.clipboardData.getData("text");
    if(isNaN(value)) return 
    const updatedValue = value.toString().split("").slice(0, OTPinput.length);
    setOTPinput(updatedValue);

const focusedInput = e.target.parentNode.querySelector("input:focus")
if(focusedInput){
    focusedInput.blur();
}

// const lastInput = e.target.parentNode.querySelector('input[type="password"]:last-child')
// if(lastInput){
//     lastInput.focus();
// }

   
  }
  function resendOTP() {
    if (disable) return;
   
  }
  function verfiyOTP() {

    if (parseInt(OTPinput.join("")) === otp) {
        navigate(redirect || '/reset-password', {state:data});
        // helps refresh
        //window.location.href = redirect || '/reset-password';
       //Navigate("/reset-password");
      return;
    }
      console.log(parseInt(OTPinput.join("")), otp, OTPinput)
  toast.success('The code you have entered is not correct, try again or re-send the link');
      return;
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

return (
    <section className={`container ${styles.auth}`}>
 
        <div className={styles.img}>
        <img src={loaderImage} alt="img" width={500} />
        </div>

         <Card>
         <div className={styles.form}>
         <p>We have sent a code to your email {id} {email}</p>
            <h2 className="mt-4">OTP Verification</h2>
            {/* <form > */}
              <div className="otp-area">

    {
      OTPinput.map((data, index) =>{
        return <input
         key={index}
          type="password"
          maxLength={1}
          value={data}  
          onChange={(e) => handleChange(e, index)}
          onPaste={(e) => handlePaste(e)}
          />
      })  
    }

</div> 
          
           <button 
           className="--btn --btn-primary --btn-block"
           //onClick={() => alert(OTPinput.join(""))}
        
           onClick={() => verfiyOTP()}
           >Submit</button>  

             <div className="mt-4">
                    <p>Didn't recieve code?  <Link
                      className=""
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    to="/forgetpassword" 
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </Link> </p>{" "}
                   
                  </div> 
        
           {/* </form> */}
           
         </div>
         </Card>
        
        </section>
  )
}
export default OTPInput
