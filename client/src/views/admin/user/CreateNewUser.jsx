import InputField from 'components/fields/InputField';
import Card from "components/card";
import React, {useState, useEffect} from 'react';
import SelectCustom from 'components/select';
import FileUpload from 'components/fileUpload';
import Select from 'react-select'
import { MdOutlineSave } from "react-icons/md";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import storage from "../../../firebase"
import { ToastContainer, toast } from 'react-toastify';
import {useParams} from 'react-router-dom';

const CreateNewUser = (props) => {
    const params = useParams();
    const {context} = props
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState('');
    const [str, setStr] = useState('');
    const [status, setStatus] = useState('');
    const [listRole, setListRole] = useState([]);
    const [listWarehouse, setListWarehouse] = useState({
        multiValue: [],
        filterOptions: []
      })
    useEffect(() => {
        async function getData() {
            const urls = [ "http://localhost:5000/api/role/get", "http://localhost:5000/api/warehouse/get" ]
            const requests = urls.map(url => fetch(url).then(response => response.json()));
            const jsonData =  await Promise.all(requests);
            const getListRole = jsonData[0].map(item => ({
                key: item.name,
                value: item._id
            }))
            const getListWH = jsonData[1].map(item => ({
                label: item.name,
                value: item._id
            }))
            setListRole(getListRole);
            setListWarehouse({
                ...listWarehouse,
                filterOptions: getListWH
            });
            if(params.userId) {
                let urlGetInfoProduct = `http://localhost:5000/api/user/detail/${params.userId}`
                fetch(urlGetInfoProduct)
                    .then((response) => response.json())
                    .then((data) => {
                        setPassword(data.password);
                        setName(data.name);
                        setEmail(data.email);
                        setPhone(data.phone);
                        setAddress(data.address);
                        setStatus(data.status);
                        setRole(data.role._id);
                        if (data.warehouseId.length) {
                            setListWarehouse({
                                ...listWarehouse,
                                filterOptions: getListWH,
                                multiValue: data.warehouseId.map(item => ({
                                    label: item.name,
                                    value: item._id}))
                            });    
                        }
                        setStr(data.avatar);
                    });
            }
        }
        getData();
    }, [params.userId]);

    const handleSave = async () => {
        setLoading(true)
        let url = 'http://localhost:5000/api/user/';
        let method = "POST";
        let textAlert = "Tạo mới thành công";
        if (params.userId) {
            url = `http://localhost:5000/api/user/edit/${params.userId}`;
            method = "PUT";
            textAlert = 'Sửa thành công'
        }
        const idListWH = listWarehouse.multiValue?.map(item => item.value)
        const data = {
            name,
            password,
            email,
            phone,
            status,
            address,
            avatar: str,
            role,
            warehouseId: idListWH
        };
        const postToApi = () => {
            fetch(url,
            {
                headers: {
                'Content-Type': 'application/json'
                },
                method: method,
                body: JSON.stringify(data)
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
        if (image) {
            const storageRef = ref(storage, `/files/${image.name}`);
            // progress can be paused and resumed. It also exposes progress updates.
            // Receives the storage reference and the file to upload.
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    //nothing
                },
                (error) => {
                    console.log(error);
                },
                () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    data.avatar = url;
                    postToApi();
                });
                }
            );
        } else {
            postToApi();
        }
}

    const handleMultiChange = (option) =>  {
        setListWarehouse({
            ...listWarehouse,
            multiValue: option
        })
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
                        <InputField label="Tên người dùng" id="nameUser" placeholder="Nhập tên người dùng" type="text" value={name} handleChangeValue={setName}/>
                        <InputField label="Email" id="email" placeholder="Nhập email" type="email" extra="mt-2 mb-2"  value={email} handleChangeValue={setEmail}/>
                        <InputField label="Mật khẩu" id="password" placeholder="Nhập mật khẩu" type="password" extra="mt-2 mb-2"  value={password} handleChangeValue={setPassword}/>
                        <InputField label="Số điện thoại" id="numberPhone" placeholder="Nhập số điện thoại" type="number" extra="mt-2 mb-2"  value={phone} handleChangeValue={setPhone}/>
                        <InputField label="Địa chỉ" id="address" placeholder="Nhập địa chỉ" type="text" extra="mt-2 mb-2"  value={address} handleChangeValue={setAddress}/>
                        <SelectCustom label="Trạng thái" placeholder="Chọn trạng thái"  id="status" extra="mb-2" data={[{key:"Đang hoạt động", value:true}, {key:"Tạm dừng", value:false}]} value={status} handleChangeValue={setStatus}/>
                        <SelectCustom label="Vai trò" placeholder="Chọn đơn vị tính"  id="unit" extra="mb-2" data={listRole} value={role} handleChangeValue={setRole}/>
                        <div className='mb-2'>
                            <label  className='text-sm text-navy-700 dark:text-white ml-3 font-bold'>Kho</label>
                            <Select
                                className='mt-2'
                                name="filters"
                                placeholder="Chọn kho"
                                value={listWarehouse.multiValue}
                                options={listWarehouse.filterOptions}
                                onChange={handleMultiChange}
                                isMulti
                            />
                        </div>
                        <FileUpload label="Ảnh người dùng" id="image" extra="mb-5" setFile={setImage}/>
                        <div className='btn-submit-data'>
                             <button id={loading && "text-overlay"} className="ms-2 bg-blue-500 text-white text-sm px-2 py-2 rounded flex items-center" onClick={handleSave}><MdOutlineSave/> Lưu thông tin</button>
                             <div className={loading && "loading"}></div>
                        </div>
                        <ToastContainer />
                </div>
            </Card>
        </div>
    );
}

export default CreateNewUser;

