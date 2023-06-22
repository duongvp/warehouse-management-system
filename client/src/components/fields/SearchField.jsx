import React from 'react'

export default React.memo(function SearchField(props) {
 const {placeholder, extra, value, handleChangeValue, type} = props
 return (
  <div className='mr-2'>
     <div className={`h-[35.5px]  items-center rounded bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white  ${extra || 'xl:w-[210px]'}`}>
        <input
            type= {type ||"text"}
            placeholder={placeholder}
            class="pl-3 pr-2 block h-full md:w-full rounded bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
            value={value}
            onChange={(e) => handleChangeValue(e.target.value)}
        />
    </div>
  </div>
  )
})
