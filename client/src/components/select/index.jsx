import {memo} from 'react'

export default memo(function Select(props) {
  const { label, placeholder, id, data, extra, value, handleChangeValue} = props;  
  const handleSelectOption = (e) => {
     handleChangeValue(e.target.value)
  }
  return (
    <>
        <label for={id} className="ml-3 mb-2 text-sm font-bold text-navy-700 dark:text-white">{label}</label>
        <select id={id} className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-black ${extra}`} value={value} onChange={handleSelectOption}  defaultValue={''}>
            <option value="" disabled>{placeholder}</option>
            {data.map((item, index) => (
                <option value={item.value} key={`${item.value}_${index}`}>{item.key}</option>
            ))}
        </select>
    </>
  )
})
