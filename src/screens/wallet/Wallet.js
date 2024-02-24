import React, { useEffect, useState, useContext, useReducer } from 'react';
import PageMenu from '../../components/pageMenu/PageMenu';
import './Wallet.scss';
import mcImg from '../../assets/mc_symbol.png';
import paymentImg from '../../assets/payment.svg';
import {
  AiFillDollarCircle,
  AiFillGift,
  AiOutlineDollarCircle,
} from 'react-icons/ai';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { FaRegPaperPlane } from 'react-icons/fa';
import WalletTransactions from './WalletTransactions';
import TransferModal from './TransferModal';

import { toast } from 'react-toastify';

import DepositModal from './DepositModal';
import {
  Navigate,
  useNavigate,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import { Store } from '../../Store';
import { getError } from '../utils';
import Loader from '../../components/loader/Loader';
// import { BACKEND_URL } from "../../utils";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, owner: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, payments: action.payload, error: '' };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'TRANSFER_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'TRANSFER_SUCCESS':
      return { ...state, loading: false, transfers: action.payload, error: '' };
    case 'TRANSFER_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'VERRIFY_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'VERRIFY_SUCCESS':
      return { ...state, loading: false, user: action.payload, success: true };
    case 'VERRIFY_FAIL':
      return { ...state, loading: false };
    case 'VERRIFY_RESET':
      return { ...state, loading: false, success: false, user: '' };
    case 'TRANS_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'TRANS_SUCCESS':
      return { ...state, loading: false, trans: action.payload, success: true };
    case 'TRANS_FAIL':
      return { ...state, loading: false };
    case 'TRANS_RESET':
      return { ...state, loading: false, success: false, user: '' };
    case 'DEPOSIT_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'DEPOSIT_SUCCESS':
      return {
        ...state,
        loading: false,
        deposits: action.payload,
        success: true,
      };
    case 'DEPOSIT_FAIL':
      return { ...state, loading: false };
    case 'DEPOSIT_RESET':
      return { ...state, loading: false, success: false, user: '' };
    default:
      return state;
  }
}

// const transactions = [
//   {
//     trans_id: 1,
//     trans_date: '31-2-2023',
//     amount: 100,
//     sender: 'mafuz@gmail.com',
//     receiver: 'Mahafuzu Mutaru',
//     description: 'Paystack Deposit',
//     status: 'Success',
//   },
// ];

const initialState = {
  amount: 0,
  sender: '',
  receiver: '',
  user: '',
  payments: '',
  transfers: [],
  deposits: '',
  owner: '',
  trans: '',
  description: '',
  status: '',
};

const initialDepositState = {
  amount: 0,
  paymentMethod: '',
};

const Wallet = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/wallet';

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [deposit, setDeposit] = useState(initialDepositState);
  const [isVerified, setIsVerified] = useState(false);
  const [transferData, setTransferData] = useState(initialState);
  const { amount, sender, receiver, description, status } = transferData;
  const { amount: depositAmount, paymentMethod } = deposit;

  const publicKey = process.env.REACT_APP_API_KEY;
  const url = process.env.REACT_APP_DEV_BASE_URL;
  //const amount = order[0]?.totalprice * 100

  const currency = 'GHS';
  const email = userInfo?.email;
  const name = userInfo?.username;
  const phone = '0501399430';

  const [
    {
      loading,
      error,
      trans,
      user,
      owner,
      payments,
      deposits,
      transfers,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    //orders: [],

    loading: true,
    error: '',
    user: '',
    trans: '',
    transfers: [],
    owner: '',
    payments: '',
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const closeModal = (e) => {
    if (e.target.classList.contains('cm')) {
      console.log('cm here');
      setShowTransferModal(false);
      setShowDepositModal(false);
      setTransferData({ ...initialState });
      setDeposit({ ...initialDepositState });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
    setIsVerified(false);
    dispatch({ type: 'VERRIFY_RESET' });
    // dispatch(RESET_TRANSACTION_MESSAGE());
  };

  const componentProps = {
    email,
    amount: depositAmount * 100,
    currency,
    metadata: {
      name,
      phone,
    },
    publicKey,
    text: 'Proceed',

    onSuccess: () => onApprove(),

    // alert("Thanks for doing business with us! Come back soon!!"),
    onClose: () => alert("Wait! Don't leave :("),
  };

  async function onApprove(data, action) {
    depositMoney();
    try {
      dispatch({ type: 'DEPOSIT_REQUEST' });
      const { data } = await axios.put(
        `${url}/api/receiverUpdate`,

        {
          amount: depositAmount,
          receiver: userInfo.email,
        },
        {
          headers: {
            //'Content-Type': 'application/json',
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      dispatch({ type: 'DEPOSIT_SUCCESS', payload: data });
      closeModal();
      
    } catch (err) {
      toast.error(getError(err));
    }
  }

  const depositMoney = async () => {
    // e.preventDefault();
    const formData = {
      ...deposit,
      description: 'Paystack deposit',
      sender: 'Self',
      receiver: userInfo.email,
      status: 'Success',
      user_id: userInfo.id,
    };
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        `${url}/api/deposittransfer`,
        {
          formData,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );
      setTimeout(() => {
        navigate(redirect || '/wallet');
        // helps refresh
        window.location.href = redirect || '/wallet';
      }, 6000);

      dispatch({ type: 'CREATE_SUCCESS', payload: data });

      toast.success(data);
      //const id = data;
    } catch (err) {
      // dispatch({ type: 'VERRIFY_RESET' });
      toast.error(getError('Wallet transfer Failed'));
    }

    
  };



  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        dispatch({ type: 'TRANSFER_REQUEST' });
        //setLoading(true);
        const { data } = await axios.get(
          `${url}/api/transactions/` + userInfo?.id,

          {
            headers: { authorization: 'Bearer ' + userInfo.token },
          }
        );
        dispatch({ type: 'TRANSFER_SUCCESS', payload: data });
        //setLoading(false);
      } catch (err) {
        dispatch({ type: 'TRANSFER_FAIL', payload: getError(err) });
        //setLoading(false);
      }
    };

    fetchTransactions();
    // forceUpdate();
  }, [transfers]);

  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setDeposit({ ...deposit, [name]: value });
  };

  const transferMoney = async () => {
    // e.preventDefault();
    try {
      if (amount < 1) {
        return toast.error('Please enter a valid amount');
      }
      if (!description) {
        return toast.error('Please enter a description');
      }

      const formData = {
        ...transferData,
        sender: userInfo.email,
        status: 'Success',
        user_id: userInfo.id,
      };
      try {
        dispatch({ type: 'CREATE_REQUEST' });

        const { data } = await axios.post(
          `${url}/api/fundstransfer`,
          {
            formData,
          },
          {
            headers: {
              authorization: 'Bearer ' + userInfo.token,
            },
          }
        );

        navigate(`/wallet`);
        dispatch({ type: 'CREATE_SUCCESS', payload: data });

        // dispatch({ type: 'VERRIFY_RESET' });

        toast.success('Wallet transfer successfull');
        //const id = data;
      } catch (err) {
        // dispatch({ type: 'VERRIFY_RESET' });
        toast.error(getError('Wallet transfer Failed'));
      }

      Promise.all([
        // transferWallet(),

        axios.put(`${url}/api/receiverUpdate`, {
          sender: userInfo.email,
          amount: amount,
          receiver: receiver,
        }),
        axios.put(`${url}/api/senderUpdate`, {
          sender: userInfo.email,
          amount: amount,
          receiver: receiver,
        }),
      ])
        .then(function (responses) {
          // Get a JSON object from each of the responses
          return Promise.all(
            responses.map(function (response) {
              return response.json();
            })
          );
        })
        .then(function (data) {
          // Log the data to the console
          // You would do something with both sets of data here
          //console.log(data);
        })
        .catch(function (error) {
          // if there's an error, log it
          console.log(error);
        });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
    // await dispatch(getUser());
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        // setState({ ...state, loading: true });
        dispatch({ type: 'FETCH_REQUEST' });
        fetch(`${url}/api/user/` + userInfo?.id, {
          method: 'GET',
          //headers: new Headers({
          headers: { authorization: 'Bearer ' + userInfo.token },
          //}),
        })
          .then(function (res) {
            return res.json();
          })

          .then(function (data) {
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
            // console.log(data);
          });

        //setState({ ...state, loading: false });
        //dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        //setState({ ...state, loading: false });
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchOrder();
  }, []);

  const verifyReceiverAccount = async () => {
    if (!receiver) {
      return toast.error("Please add a valid account email");
    }
    const formData = {
      receiver,
    };

    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        `${url}/api/user`,
        {
          formData,
        },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );

      dispatch({ type: 'VERRIFY_SUCCESS', payload: data });

      // dispatch({ type: 'VERRIFY_RESET' });

      toast.success('Receiver verified successfully');
      //const id = data;

      // navigate(`/checkout-success`);
      //navigate(`/order/${id}`);
    } catch (err) {
      dispatch({ type: 'VERRIFY_RESET' });
      toast.error('Verification Failed');
    }
    // console.log("Verify Account");

    // if (!validateEmail(receiver)) {
    //   return toast.error("Please add a valid account email");
    // }
    // const formData = {
    //   receiver,
    // };
    // console.log(formData);

    // dispatch(verifyAccount(formData));
  };
  //console.log(user);
  useEffect(() => {
    if (user !== '') {
      setIsVerified(true);
    }
    if (dispatch({ type: 'CREATE_SUCCESS' })) {
      setTransferData({ ...initialState });
      setShowTransferModal(false);
      setShowDepositModal(false);
      setIsVerified(false);
    }
    // dispatch(RESET_TRANSACTION_MESSAGE());
  }, [user, dispatch]);
  // // const getTransac = () => {
  //   if (user) {
  //     const formData = {
  //       email: user.email,
  //     };
  //     // dispatch(getUserTransactions(formData));
  //   }
  // };
  // useEffect(() => {
  //   getTransac();
  // }, [dispatch]);

  const makeDeposit = async (e) => {
    e.preventDefault();
    if (deposit.amount < 1) {
      return toast.error('Please enter amount greater than 0');
    }
    // console.log(depositAmount);
    // if (paymentMethod === "stripe") {
    //   const { data } = await axios.post(
    //     `${BACKEND_URL}/api/transaction/depositFundStripe`,
    //     {
    //       amount: depositAmount,
    //     }
    //   );
    //   // console.log(data);
    //   // window.open(data.url);
    //   window.location.href = data.url;
    //   return;
    // }
    if (paymentMethod === '') {
      return toast.error('Please select a payment method.');
    }
  };

  return (
    <>
      {payments === 'Saved Successful' && <Confetti />}
      <section>
        {/* {isLoading && <Loader />} */}
        <div className="container">
           {/* <pre>{JSON.stringify(owner)}</pre>  */}
          <PageMenu />
          <div className="wallet">
            <div className="wallet-data --flex-start --flex-dir-column">
              <div className="wallet-info --card --mr">
                <span>Good Day...</span>
                <h4>
                  {userInfo?.firstname} {userInfo?.lastname}
                </h4>
                <hr />
                <span className="--flex-between">
                  <p>Account Balance</p>
                  <img alt="mc" src={mcImg} width={50} />
                </span>
                <h4>GHS{owner[0]?.balance?.toFixed(2)}</h4>
                <div className="buttons --flex-center">
                  <button
                    className="--btn --btn-primary"
                    onClick={() => setShowDepositModal(true)}
                  >
                    <AiOutlineDollarCircle /> &nbsp; Deposit Money
                  </button>
                  <button
                    className="--btn --btn-danger"
                    onClick={() => setShowTransferModal(true)}
                  >
                    <FaRegPaperPlane /> &nbsp; Transfer
                  </button>
                </div>
              </div>

              <div className="wallet-promo --flex-between --card">
                <div className="wallet-text">
                  <span className="--flex-start">
                    <AiFillDollarCircle size={25} color="#ff7722" />
                    <h4>mafuzdynamics Wallet</h4>
                  </span>
                  <span className="--flex-start">
                    <h4>Cashback up to 80%</h4>
                    <AiFillGift size={20} color="#f0c040" />
                  </span>
                  <span>
                    Use your mafuzdynamics wallet at checkout and get up to 80%
                    cashback.
                  </span>
                </div>
                <div className="wallet-img">
                  <img src={paymentImg} alt="pay" width={150} height={170} />
                </div>
              </div>
            </div>
            {userInfo?.username !== null && (
              <WalletTransactions transactions={transfers} />
            )}
          </div>
          {showTransferModal && (
            <TransferModal
              closeModal={closeModal}
              transferData={transferData}
              handleInputChange={handleInputChange}
              handleAccountChange={handleAccountChange}
              user={user}
              onSubmit={transferMoney}
              verifyReceiverAccount={verifyReceiverAccount}
              isVerified={isVerified}
              Loader={Loader}
            />
          )}
          {showDepositModal && (
            <DepositModal
              closeModal={closeModal}
              handleDepositChange={handleDepositChange}
              onSubmit={makeDeposit}
              componentProps={componentProps}
              deposit={deposit}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Wallet;
