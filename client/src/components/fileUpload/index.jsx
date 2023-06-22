import React from 'react';

const FileUpload = (props) => {
    const {label, id, extra, setFile} = props
    const handleFileChange = (e) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };
    return (
        <>      
              <label
                    htmlFor={id}
                    className="ml-3 mb-2 text-sm font-bold text-navy-700 dark:text-white"
              >
                {label}
              </label>  
              <input className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-black ${extra}`} id="file_input" type="file" onChange={handleFileChange}></input>
        </>
    );
}

export default FileUpload;
