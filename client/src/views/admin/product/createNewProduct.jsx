import InputField from 'components/fields/InputField';
import TextExtraField from 'components/fields/TextField';
import Card from "components/card";
import React, {useState, useEffect} from 'react';
import Select from 'components/select';
import FileUpload from 'components/fileUpload';
import { MdOutlineSave } from "react-icons/md";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import storage from "../../../firebase"
import { ToastContainer, toast } from 'react-toastify';
import {useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateNewProduct = (props) => {
    let currentWH = useSelector((state) => state.warehouse.data);
    const params = useParams();
    const {context} = props
    const [loading, setLoading] = useState(false)
    const [idProduct, setIdProduct] = useState('');
    const [nameProduct, setNameProduct] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState();
    const [image, setImage] = useState('');
    const [urlImage , setUrlImage] = useState('')
    const [status, setStatus] = useState('');
    const [retailPrice, setRetailPrice] = useState('');
    const [wholeSale, setWholeSale] = useState('');
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const [listUnit, setListUnit] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    useEffect(() => {
        async function getData() {
            const urls = [ `http://localhost:5000/api/unit/get`, "http://localhost:5000/api/category/get" ]
            const requests = urls.map(url => fetch(url).then(response => response.json()));
            const jsonData =  await Promise.all(requests);
            const getListUnit = jsonData[0].map(item => ({
                key: item.name,
                value: item._id
            }))
            const getListCate = jsonData[1].map(item => ({
                key: item.name,
                value: item._id
            }))
            setListUnit(getListUnit);
            setListCategory(getListCate);
        }
        getData();
    }, []);
    useEffect(() => {
        if(params.proId) {
            let urlGetInfoProduct = `http://localhost:5000/api/product/detail/${params.proId}/warehouse/${currentWH}`
            fetch(urlGetInfoProduct)
                .then((response) => response.json())
                .then((data) => {
                    setIdProduct(data._id);
                    setNameProduct(data.name);
                    setPrice(data.importPrice);
                    setRetailPrice(data.costPrice);
                    setWholeSale(data.warehouse[0]?.instock);
                    setStatus(data.status)
                    setUrlImage(data.image)
                    setCategory(data.categoryId)
                    setUnit(data.unitId)
                });
        }
        return () => {
            // cleanup
            params.proId = ""
        };
    }, [params.proId]);

    useEffect(()=>{
        if (image) {
            setUrlImage(URL.createObjectURL(image))
            // const storageRef = ref(storage, `/files/${image.name}`);
            // // progress can be paused and resumed. It also exposes progress updates.
            // // Receives the storage reference and the file to upload.
            // const uploadTask = uploadBytesResumable(storageRef, image);
            // uploadTask.on(
            //     "state_changed",
            //     (snapshot) => {
            //         //nothing
            //     },
            //     (error) => {
            //         console.log(error);
            //     },
            //     () => {
            //     // download url
            //     getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //         setUrlImage(url)
            //     });
            //     }
            // );
        }
    }, [image])

    const handleSave = () => {
        let url = "http://localhost:5000/api/product/create";
        let method = 'POST';
        let textAlert = 'Thêm mới thành công'
        if (params.proId) {
            url = `http://localhost:5000/api/product/edit/${params.proId}`;
            method = "PUT";
            textAlert = 'Sửa thành công'
        }
        const data = {
            name: nameProduct,
            importPrice: price,
            costPrice: retailPrice,
            instock: wholeSale,
            status: status,
            image: '',
            category: category,
            unit: unit,
            warehouseId: currentWH
        }
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
            setLoading(true)
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
                    data.image = url
                    postToApi();
                });
                }
            );
        } else if (params.proId) {
            setLoading(true)
            data.image = urlImage;
            postToApi();
        }
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
                        {!params.proId && <InputField label="Mã sản phẩm" id="sku" placeholder="Nhập mã sản phẩm" type="text" value={idProduct} handleChangeValue={setIdProduct}/>}
                        <InputField label="Tên sản phẩm" id="name" placeholder="Nhập tên sản phẩm" type="text" extra="mt-2 mb-2"  value={nameProduct} handleChangeValue={setNameProduct}/>
                        <Select label="Đơn vị tính" placeholder="Chọn đơn vị tính"  id="unit" extra="mb-2" data={listUnit} value={unit} handleChangeValue={setUnit}/>
                        <Select label="Trạng thái" placeholder="Chọn trạng thái"  id="status" extra="mb-2" data={[{key:"Đang bán", value:true}, {key:"Tạm dừng", value:false}]} value={status} handleChangeValue={setStatus}/>
                        <Select label="Loại sản phẩm" placeholder="Chọn loại sản phẩm"  id="category" extra="mb-2" data={listCategory} value={category} handleChangeValue={setCategory}/>
                        <InputField label="Giá nhập" id="price" placeholder="Giá nhập" type="number" extra="my-2"  value={price} handleChangeValue={setPrice}/>
                        <InputField label="Giá bán sản phẩm" id="retailPrice" placeholder="Giá bán lẻ sản phẩm" type="number" extra="mt-2"  value={retailPrice} handleChangeValue={setRetailPrice}/>
                        <InputField label="Tồn kho" id="wholeSale" placeholder="Tồn kho" type="number" extra="mt-2"  value={wholeSale} handleChangeValue={setWholeSale}/>
                        <TextExtraField label="Ghi chú" id="note" placeholder="Ghi chú"  extra="mt-2 mb-2" value={note} handleChangeValue={setNote}/>
                        <FileUpload label="Ảnh sản phẩm" id="image" extra="mb-2" setFile={setImage}/>
                        <div>
                            {urlImage && <img className="rounded w-[250px] h-[250px] object-cover" src={urlImage} alt="" />}
                        </div>
                        <div className='btn-submit-data mt-5'>
                             <button id={loading && "text-overlay"} className="ms-2 bg-blue-500 text-white text-sm px-2 py-2 rounded flex items-center" onClick={handleSave}><MdOutlineSave/> Lưu thông tin</button>
                             <div className={loading && "loading"}></div>
                        </div>
                        <ToastContainer />
                </div>
            </Card>
        </div>
    );
}

export default CreateNewProduct;
