import React, {useEffect, useState} from "react";
import { logOutUser } from '../actions';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [myBugs, setMyBugs] = useState([]);

    const dispatch = useDispatch(); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',  "Authorization" : `Bearer ${token}` }
        };
    
        fetch('/users-bugs', options)
        .then(response => response.json())
        .then(data => { 
            if(data.authenticated === false) dispatch(logOutUser());
    
            if(data.authenticated === true) {
                setMyBugs(data.bugs);
            }
    
        });
    }, [])

  return(
    <>
    <form className="search-form">
        <input value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
            className="search" 
            type="search" 
            placeholder="Search by name, Bugs or Other" />
        {keyword && 
          <i onClick={e => setKeyword('')} className="fa fa-times-circle-o clear-searchfield" aria-hidden="true"></i> 
        }
    </form>

    <ul className="search-dropdown" style={{padding: keyword && '10px 0'}}>
        {keyword && myBugs.filter(bugs=>bugs.bug_name.toLowerCase().includes(keyword)).map((item) => (
            <li key={item._id} className="bug-list-item">
                <Link to={'/bug/' + item._id}>{item.bug_name}</Link>
            </li>
        ))} 
    </ul>
    </>
  )
}

export default Search;