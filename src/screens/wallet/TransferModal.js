import React, { useEffect, useRef } from "react";
import "./TransferModal.scss";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";

const TransferModal = ({
  closeModal,
  onSubmit,
  transferData,
  handleInputChange,
  handleAccountChange,
  verifyReceiverAccount,
  user,
  isVerified,
  isLoading,
}) => {
  const { account } = transferData;
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section className="--100vh modal-section cm" onClick={closeModal}>
      <div className="--flex-center modal">
        <div className="--bg-light --p --card modal-content">
          <AiOutlineClose
            color="red"
            size={16}
            className="close-icon cm"
            onClick={closeModal}
          />
          <div className="--flex-start modal-head --my">
            <AiOutlineInfoCircle color="orangered" size={18} />
            <h3 className="--text-p --ml">Send Money To Someone.</h3>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <p className="req">
              <label>Amount</label>
                <input
                className="radio-label"
                  ref={inputRef}
                  type="text"
                  placeholder="Amount"
                  required
                  name="amount"
                  value={transferData.amount}
                  onChange={handleInputChange}
                />
              </p>
             
              <p className="req">
                 <label>Receiver's Account</label>
                {user !== "" && (
                 <p><b>Account name: </b>{user.firstname} {user.lastname}</p>
                )}
                <span className="--flex-end">
                  <input
                  
                    className="radio-label Receiver's account"
                    type="text"
                    placeholder="Enter your email"
                    required
                    name="receiver"
                    value={transferData.receiver}
                    onChange={handleAccountChange}
                  />
                  <input
                    className="--btn --btn-danger --btn-lg"
                    type="button"
                    placeholder="alias"
                    name="shortURL"
                    value={"Verify"}
                    onClick={verifyReceiverAccount}
                  />
                </span>
              </p>
              <p className="req">
                <label>Description</label>
                <input
                className="radio-label"
                  type="text"
                  placeholder="Description"
                  required
                  name="description"
                  value={transferData.description}
                  onChange={handleInputChange}
                />
              </p>
              {!isVerified && (
                <p className="--color-danger">
                  Please click the verify button above!!!
                </p>
              )}
              {isVerified && (
                <span className="--flex-end modal-footer">
                  <button className="--btn --btn-lg cm" onClick={closeModal}>
                    Cancel
                  </button>
                  {/* <button
                    type="submit"
                    className="--btn --btn-primary --btn-lg"
                  >
                    Send
                  </button> */}
                  {isLoading ? (
                    <button
                      type="submit"
                      className="--btn --btn-primary --btn-lg"
                      disabled
                    >
                      Sending...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="--btn --btn-primary --btn-lg"
                    >
                      Send
                    </button>
                  )}
                </span>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransferModal;
