import React, { useEffect, useRef } from 'react';
import './DepositModal.scss';
import { AiOutlineClose, AiOutlineInfoCircle } from 'react-icons/ai';
import { PaystackButton } from 'react-paystack';

const DepositModal = ({
  closeModal,
  onSubmit,
  componentProps,
  handleDepositChange,
  deposit,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

   const {amount, paymentMethod} = deposit;

  return (
    <section className="--100vh modal-section cm" onClick={closeModal}>
      
      <div className="--flex-center modal ">
      
        <div className="--bg-light --p --card modal-content">
          <AiOutlineClose
            color="red"
            size={16}
            className="close-icon cm"
            onClick={closeModal}
          />
          <div className="--flex-start modal-head --my">
          {/* <pre>{JSON.stringify(paymentMethod)}</pre>  */}
            <AiOutlineInfoCircle color="orangered" size={18} />
            <h3 className="--text-p --ml">Deposit Funds into your wallet.</h3>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <p>
                <label>Amount</label>
                <input
                  className="radio-label"
                  ref={inputRef}
                  type="text"
                  placeholder="Amount"
                  required
                  name="amount"
                  value={deposit.amount}
                  onChange={handleDepositChange}
                />
              </p>
              <p>
                {/* <label htmlFor={"stripe"} className="radio-label">
                  <input
                    className="radio-input"
                    type="radio"
                    name={"paymentMethod"}
                    id={"stripe"}
                    value={"stripe"}
                    onChange={handleDepositChange}
                  />
                  <span className="custom-radio" />
                  Stripe
                </label> */}
                <br />
                <label htmlFor={'paystack'} className="radio-label">
                  <input
                    className="radio-input"
                    type="radio"
                    name={'paymentMethod'}
                    id={'paystack'}
                    value={'paystack'}
                    onChange={handleDepositChange}
                  />
                  <span className="custom-radio" />
                  Paystack
                </label>
              </p>
              <br />
              <span className="--flex-end modal-footer">
                <button className="--btn --btn-lg cm" onClick={closeModal}>
                  Cancel
                </button>
                {paymentMethod === "paystack" ? (
                  <PaystackButton
                    {...componentProps}
                    className="--btn --btn-primary --btn-lg"
                  />
                 ) 
                 : ( 
                  <button
                    type="submit"
                    className="--btn --btn-primary --btn-lg"
                  >
                    Proceed
                  </button>
                )} 
              </span>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepositModal;
