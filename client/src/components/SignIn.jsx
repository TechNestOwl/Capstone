import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInInfo } from '../actions/signInAction';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';


export default function SignIn(props) {

    const dispatch = useDispatch();
    const [usernameSignIn, setUsernameSignIn] = useState("");

    const setUsername = useSelector(state => state.signInReducer);


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ usernameSignIn });
        signInInfo(dispatch, setUsernameSignIn);
    }

    return (
        <div>
            <form className="signUpForm" onSubmit={e => { handleSubmit(e) }}>
                <h1>Sign In</h1>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={usernameSignIn}
                    onChange={e => setUsernameSignIn(e.target.value)}
                ></input>

                <input
                    type="password"
                    // value="userPassword"
                    placeholder="Enter password"
                ></input>

                {/* <button type="submit">Submit</button> */}
                <Button type="submit" className="submitButton">Submit</Button>

            </form>
            <h5>Don't have a user log-in?</h5>
            <p>Continue here to sign up</p>
            <Link to="/signup">
                <button href="#" className="submitButton">Sign Up</button>
            </Link>

        </div>
    )
}
