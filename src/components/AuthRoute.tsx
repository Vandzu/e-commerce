import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { changeId, changeAdmin } from '../redux/reducers/userSlice';
import { Spinner, Row } from "react-bootstrap";
import { useState } from "react";

export default function AuthRoute({ children, route }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSession, setIsSession] = useState<boolean>(false);

    axios.get('http://localhost:8000/api.php?route=login', {
        withCredentials: true
    })
        .then(res => {
            dispatch(changeId(res.data.id));
            dispatch(changeAdmin(res.data.isAdmin==1 ? true : false));
            if (res.data.isAdmin == 1 && route=='store') {
                navigate('/products');
            } else if (res.data.isAdmin != 1 && (route == 'products' || route == 'categories')) {
                navigate('/store');
            }
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