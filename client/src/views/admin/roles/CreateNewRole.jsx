import Card from 'components/card'
import InputField from 'components/fields/InputField'
import TextExtraField from 'components/fields/TextField';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function CreateNewRole(props) {
    const params = useParams();
    const {context} = props;
    const [loading, setLoading] = useState(false)
    const [dataRole, setDataRole] = useState([])   
    const [roleName, setRoleName] = useState('')
    const [note, setNote] = useState('')
    const handleCheckboxChange = (event) => {
        const { name, id } = event.target;
        if (name === 'parentCheckbox') {
          // Toggle all child checkboxes
            dataRole?.forEach(item => {
                if(item.id == id) {
                    item.isChecked = !item.isChecked;
                    item.permissions = item.permissions.map((checkbox) => ({
                        ...checkbox,
                        isChecked: item.isChecked,
                      }));
                }
            })
            setDataRole([...dataRole])
        } else {
            let idParent  = name.split('__')[1];
            dataRole?.forEach(item => {
                if(item.id == idParent) {
                    item.permissions.forEach((checkbox) => {
                        if(checkbox.id == id) {
                            checkbox.isChecked = !checkbox.isChecked
                        }
                    });
                    item.isChecked = item.permissions.every(currentValue => currentValue.isChecked == true)
                }
            })
            console.log(dataRole);
            setDataRole([...dataRole])
        }
    }

    const handleSave = () => {
        setLoading(true);
        let arr;
        let url = 'http://localhost:5000/api/role/create';
        let method = "POST";
        let textAlert = 'Thêm mới thành công';
        const permissions =  dataRole.flatMap(item => {
            arr = item.permissions.map(ele => {
                if(ele.isChecked === true) return ele.id
            })
            return arr            
        }).filter(x => x !== undefined)
        if (params.roleId) {
            url = `http://localhost:5000/api/role/edit/${params.roleId}`;
            method = "PUT";
            textAlert = 'Sửa thành công'
        }
        fetch(url,
        {
            headers: {
            'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify({
                name: roleName,
                description: note,
                permissions:permissions
            })
        }).then(function(res){ if (res.ok) {
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
    }

    useEffect(() => {
        let statusCallApi = true 
        let roleId = params.roleId
        if (statusCallApi) {
            if(roleId) {
                fetch(`http://localhost:5000/api/role/detail/${roleId}`)
                .then(res => res.json())
                .then(data => {
                    setDataRole([...data.data])
                    setRoleName(data.name)
                    setNote(data.description)
                })
            } else {
                fetch('http://localhost:5000/api/permission')
                .then(res => res.json())
                .then(data => setDataRole([...data]))
            }
        }
        return () => {
            statusCallApi = false
        };
    }, []);

    return (
        <div className='mt-5 grid h-full'>
            <Card extra={"w-full sm:overflow-auto p-4"}>
                <header className="relative flex items-center justify-between mb-8">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        {context}
                    </div>
                </header>
                <div>
                    <div className="grid grid-cols-6 gap-6 mb-5">
                        <div className="col-span-2">
                            <p className='font-bold mb-2 text-navy-700'>Chi tiết vai trò</p>
                            <p className='text-[14px] text-neutral-500'>Thông tin chi tiết của vai trò để phục vụ cho việc quản lý của sau này</p>
                        </div>
                        <div className="col-span-4">
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <InputField label="Tên vai trò" id="sku" placeholder="Nhập tên vai trò" type="text" value={roleName} handleChangeValue={setRoleName}/>
                                </div>
                                <div>
                                    <TextExtraField label="Ghi chú" id="note" placeholder="Ghi chú"  value={note} handleChangeValue={setNote}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-2">
                            <p className='font-bold mb-2 text-navy-700'>Phân quyền chi tiết</p>
                            <p className='text-[14px] text-neutral-500'>Cho phép người quản lý giới hạn quyền và vai trò trong hệ thống</p>
                        </div>
                        <div className="col-span-4">
                            {
                                dataRole.map(item => {
                                    return (
                                        <div className='mb-4'>
                                            <label className='font-medium text-[15px] text-navy-700'>
                                                <input
                                                    className='mr-1'
                                                    type="checkbox"
                                                    name="parentCheckbox"
                                                    id={item.id}
                                                    checked={item.isChecked}
                                                    onChange={handleCheckboxChange}
                                                />
                                                {item.name}
                                            </label>
                                            <div className='grid grid-cols-3 mt-2 pl-3 text-[14px] gap-y-1 text-neutral-500'>
                                                {item.permissions.map((checkbox) => (
                                                        <div className='col-span-1' key={checkbox.id}>
                                                            <label>
                                                                <input
                                                                    className='mr-1'
                                                                    type="checkbox"
                                                                    name={`parentCheckbox__${item.id}`}
                                                                    id = {checkbox.id}
                                                                    checked={checkbox.isChecked}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                {checkbox.label}
                                                            </label>
                                                        </div>
                                                ))}
                                             </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='flex justify-end mt-8'>
                        <div className="btn-submit-data">
                            <button id={loading && "text-overlay"} className="ms-2 bg-blue-500 text-white text-sm px-2 py-2 rounded flex items-center" onClick={handleSave}>Lưu thông tin</button>
                            <div className={loading && "loading"}></div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </Card>
        </div>
    )
}
