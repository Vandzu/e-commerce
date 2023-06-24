import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { changeId } from '../redux/reducers/userSlice';
import { Spinner, Row } from "react-bootstrap";
import { useState } from "react";

export default function AuthRoute({ children }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSession, setIsSession] = useState<boolean>(false);

    axios.get('http://localhost:8000/api.php?route=login', {
        withCredentials: true
    })
        .then(res => {
            dispatch(changeId(res.data.id));
            setIsSession(true);
        })
        .catch(err => {
            console.log(err);
            navigate('/');
        });

    return isSession ? (children) :
        <Row className="w-100 h-100 justify-content-center align-items-center">
            <Spinner />
        </Row>
}