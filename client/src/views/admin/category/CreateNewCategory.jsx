import InputField from 'components/fields/InputField';
import Card from "components/card";
import React, {useState, useEffect} from 'react';
import { MdOutlineSave } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import {useParams} from 'react-router-dom';

const CreateNewCategory = (props) => {
    const params = useParams();
    const {context} = props
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    useEffect(() => {
        async function getData() {
            if(params.unitId) {
                let urlGetInfoProduct = `http://localhost:5000/api/category/detail/${params.unitId}`
                fetch(urlGetInfoProduct)
                    .then((response) => response.json())
                    .then((data) => {
                        setName(data.name);
                        setEmail(data.email);
                        setPhone(data.phone);
                        setAddress(data.address);
                    });
            }
        }
        getData();
    }, [params.unitId]);

    const handleSave = async () => {
        setLoading(true);
        let url = "http://localhost:5000/api/category/create";
        let method = 'POST';
        let textAlert = 'Thêm mới thành công'
        if (params.unitId) {
            url = `http://localhost:5000/api/category/edit/${params.unitId}`;
            method = "PUT";
            textAlert = 'Sửa thành công'
        }
        const postToApi = () => {
            fetch(url,
            {
                headers: {
                'Content-Type': 'application/json'
                },
                method: method,
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    address,
                })
            })
            .then(function(res) { 
                if (res.ok) {
                 setLoading(false)
                 toast.success(textAlert, {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            }})
            .catch(function(res){ console.log(res) })
        }
        postToApi();
}
      
    return (
        <div className='mt-5 grid h-full'>
            <Card extra={"w-full sm:overflow-auto p-4"}>
                <header className="relative flex items-center justify-between">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        {context}
                    </div>
                </header>
                <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                        <InputField label="Tên loại hàng" id="nameUser" placeholder="Nhập tên loại hàng" type="text" value={name} handleChangeValue={setName}/>
                        <div className='btn-submit-data mt-4'>
                             <button id={loading && "text-overlay"} className="ms-2 bg-blue-500 text-white text-sm px-2 py-2 rounded flex items-center" onClick={handleSave}><MdOutlineSave/> Lưu thông tin</button>
                             <div className={loading && "loading"}></div>
                        </div>
                        <ToastContainer />
                </div>
            </Card>
        </div>
    );
}

export default CreateNewCategory;


