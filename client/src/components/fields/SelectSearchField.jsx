import React from 'react';

const SelectSearchField = (props) => {
    const {placeHolder, data, setDataValue, extra} = props
    return (
        <div className={`flex items-end h-[35.5px] mr-2 bg-lightPrimary dark:bg-navy-900 dark:text-white  ${extra || 'xl:w-[150px]'}`}>
            <select className={`mr-2 flex h-full placeholder-gray-600 w-full items-center justify-center rounded-xl bg-white/0 pl-2 text-sm outline-none`} onChange = {e => setDataValue(e.target.value)} >
                <option value="" class="text-gray-700">{placeHolder}</option>
                {data?.map((item, index) => (
                    <option className="text-navy-700" value={item._id} key={`${item._id}_${index}`}>{item.name}</option>
                ))}
            </select>
        </div>
    );
}

export default SelectSearchField;
