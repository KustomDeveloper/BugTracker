import React, {useEffect, useState} from "react";
import { logOutUser } from '../actions';
import { useDispatch } from 'react-redux';

const Search = ({ allBugs, username }) => {
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

    const searchBugs = (e) => {
        e.preventDefault();
        setKeyword(e.target.value);

        // console.log(Array.isArray(myBugs))
        // console.log(keyword);
        // console.log(myBugs);

        /*  See if bug title or bug description contains keyword  */

            // const filteredBugs = myBugs.filter(myBugs.bug_name )
            // console.log(myBugs.filter(bugs=>bugs.bug_name.toLowerCase().includes(keyword)))

    }

  return(
    <>
    <form className="search-form">
        <input value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
            className="search" 
            type="search" 
            placeholder="Search by name, Bugs or Other" />
        {keyword ? 
          <i onClick={e => setKeyword('')} className="fa fa-times-circle-o clear-searchfield" aria-hidden="true"></i> 
        : null}
    </form>

    <ul className="search-dropdown" style={{padding: keyword ? '10px 0' : '0'}}>
        {keyword ? myBugs.filter(bugs=>bugs.bug_name.toLowerCase().includes(keyword)).map((item) => (
            <li key={item._id} className="bug-list-item">
                <a href={'/bug/' + item._id}>{item.bug_name}</a>
            </li>
        )) : null} 
    </ul>
    </>
  )
}

export default Search;