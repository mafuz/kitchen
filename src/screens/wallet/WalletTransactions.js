import React, { useState, useContext } from "react";
import "./WalletTransactions.scss";
import ReactPaginate from "react-paginate";
import { Store } from "../../Store";

const WalletTransactions = ({ transactions }) => {
  // Begin PAGINATE

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;

  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = transactions.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(transactions.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % transactions.length;
    setItemOffset(newOffset);
  };
  // End PAGINATE
  return (
    <div className="wallet-transactions">
        {/* <pre>{JSON.stringify(currentItems)}</pre>  */}
      <hr />
      <br />
      <h3>Transactions</h3>
      <div className={"table"}>
        {transactions.length === 0 ? (
          <p>No trasfers found</p>
        ) : (
          <table>
            <thead >
              <tr>
                <th>s/n</th>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Ref Account</th>
                <th>Description</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((transaction, index) => {
                const {
                  trans_id,
                  trans_date,
                  amount,
                  sender,
                  receiver,
                  description,
                  status,
                } = transaction;
                return (
                  <tr key={trans_id}>
                    <td>{itemOffset + index + 1}</td>
                    <td>{trans_date}</td>
                    <td>{trans_id}</td>
                    <td>
                      {"GHS"}
                      {amount}
                    </td>
                     <td>{sender === userInfo.email ? "Debit" : "Credit"}</td>
                    <td>{sender === userInfo.email ? receiver : sender}</td> 
                    <td>{description}</td>
                    <td>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </div>
  );
};

export default WalletTransactions;
