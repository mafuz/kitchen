import React, { useContext, useEffect, useReducer, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Store } from '../../../Store';
import { getError } from '../../../screens/utils';
import axios from 'axios';


// const data = [
//     { name: "Group A", value: 400 },
//     { name: "Group B", value: 300 },
//     { name: "Group C", value: 300 },
//     { name: "Group D", value: 200 }
//   ];
  
const pie = [
    {sum:56, category:"Farm produce"},
        
         {sum:126, category:"floor"}
         ]

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          pie: action.payload,
          loading: false,
        };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

function PieComponetQty() {

    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        pie: [],
        error: '',
      });

      const url = process.env.REACT_APP_DEV_BASE_URL;

      const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const p = Number(pie);
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
      }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

      const { state } = useContext(Store);
      const { userInfo } = state;
      
  useEffect(() => {
    const fetchpieData = async (pie) => {
      try {
        const { data } = await axios.get(`${url}/api/products/piechart`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchpieData();
  }, [userInfo]);

    return (
        // <div className="container">
        //     
        <div
    
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
        }}
      >
            
        <PieChart width={400} height={400}>
          <Pie
            data={pie}
            cx={200}
            cy={200}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="sum"
          >
            {pie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        </div>
      );
    }
export default PieComponetQty