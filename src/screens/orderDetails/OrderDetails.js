import React, { useEffect, useRef, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import "./OrderDetails.module.scss";
//import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { getOrder } from "../../redux/features/product/orderSlice";
// import { Spinner } from "../../components/loader/Loader";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Order from "./Order";




const OrderDetails = () => {
   const pdfRef = useRef();
  const { id } = useParams();
  // const dispatch = useDispatch();
 const navigate = useNavigate();
  // const { isLoading, isError, message, order } = useSelector(
  //   (state) => state.order
  // );
  // const [{ loading, error, order, loadingCreateReview }, dispatch] =
  // useReducer(reducer, {
  //   order: [],
  //  item: [],
  //   loading: true,
  //   error: '',
  // });

 
  // useEffect(() => {
  //   const fetchData = async () => {
  //     dispatch({ type: 'FETCH_REQUEST' });
  //     try {
  //       const result = await axios.get(`http://localhost:4000/api/order/` + id);
  //       dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
  //       // console.log(result.data);
  //     } catch (err) {
  //       dispatch({ type: 'FETCH_FAIL', payload: err.message });
  //     }

  //     //setProducts(result.data);
  //   };
  //   fetchData();
  // }, []);

  // const downloadPDF = () => {
  //   const input = pdfRef.current;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imageWidth = canvas.width;
  //     const imageHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);
  //     const imgX = (pdfWidth - imageWidth * ratio) / 2;
  //     const imgY = 30;
  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       imgX,
  //       imgY,
  //       imageWidth * ratio,
  //       imageHeight * ratio
  //     );
  //     pdf.save(`shopitoInvoice.pdf`);
  //   });
  // };
  //console.log(order);
  return <Order />;
};

export default OrderDetails;
