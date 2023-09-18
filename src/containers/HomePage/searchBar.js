import React, { useState, useEffect } from 'react';
import { getAllSpecialty } from '../../services/userService';
import '../HomePage/searchBar.scss';
import { useHistory } from 'react-router-dom'; 

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const history=useHistory();

  const fetchData = async (value) => {
    try {
      const response = await getAllSpecialty();

      if (response) {
        const data = response.data;
        const filteredData = data.filter((specialty) => {
          return specialty.name.toLowerCase().includes(value.toLowerCase());
        });
        const limitedData=filteredData.slice(0,5);
        setData(limitedData);
        setIsInputEmpty(value === "");
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
    
    // Cập nhật lớp CSS show-content dựa vào giá trị của isInputEmpty
    setIsInputEmpty(value === "");
  }

  const handleRedirectToDetail= (id)=>{
    history.push(`/detail-specialty/${id}`);
    console.log('OK');
  }
  useEffect(() => {
    fetchData("");
  }, []);

  return (
    <div className={`search-container ${isInputEmpty ? '' : 'show-content'}`}>
      <div className='search'>
        <i className='fas fa-search'></i>
        <input
          type='text'
          onChange={(event) => handleChange(event.target.value)}
          value={input}
          placeholder='Tìm chuyên khoa khám bệnh'
        />
      </div>
      <div className='search-content'>
        <ul className='ul_search'>
          {data.map((specialty) => (
            <div onClick={() =>{handleRedirectToDetail(specialty.id)}} >
            <li key={specialty.id}>{specialty.name}</li>
            </div>
          ))}
          
        </ul>
      </div>
    </div>
  );
};
