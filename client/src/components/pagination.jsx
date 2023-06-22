import React from 'react';
import {
    MdChevronRight,
    MdChevronLeft,
    MdMoreHoriz
} from "react-icons/md";

export default function Pagination({ itemsPerPage, totalItems, currentPage, setCurrentPage }){
    const pageNumbers = [];
    for(let i = 1; i<= Math.ceil(totalItems/itemsPerPage); i++){
        pageNumbers.push(i);
    }
    const goToPrev = () => {
        if(currentPage>1){
            setCurrentPage(currentPage-1)
        }
    }
    const goToNext = () => {
        if(currentPage<Math.ceil(totalItems/itemsPerPage)){
            setCurrentPage(currentPage+1)
        }
    }
    const pageItem = (number) => {
        if (number == 'e_dot' || number == 's_dot') {
            return (
                <li key={number} className="pagination-banner-item pagination-ellipsis border-y border-r border-gray-700 h-full w-7 block m-auto">
                    <a className="btn-next-prev flex justify-center items-center h-full">
                        <MdMoreHoriz />
                    </a>
                </li>
            );
        } else {
            return (
                <li key={number} className="pagination-banner-item cursor-pointer">
                    <a className={`${currentPage==number?"active text-white bg-gray-700": ""} border-y border-r text-center border-gray-700  w-7 block`} onClick={() => setCurrentPage(number)}>{number}</a>
                </li>
            );
        }
    }
    const renderPages = (totalPage, currentPage) => {
        const showSDots = currentPage > 4;
        const showEDots = currentPage < totalPage - 3;      
        const r = [];
        if (totalPage <= 7) {
            for (let i = 1; i <= totalPage; i++) {
                r.push(pageItem(i));
            }
        } else {
            r.push(pageItem(1));
            if (showSDots) {
                r.push(pageItem('s_dot'));
            } else {
                for (let i = 2; i <= 4; i++) {
                    r.push(pageItem(i));
                }
            }
            if (showSDots && showEDots) {
                for (let i = currentPage-1; i <= currentPage+1; i++) {
                    r.push(pageItem(i));
                }
            }
            if (showEDots) {
                r.push(pageItem('e_dot'));
            } else {
                for (let i = totalPage -3; i < totalPage; i++) {
                    r.push(pageItem(i));
                }
            }
            r.push(pageItem(totalPage));
        }
        return r;
    }
    return(
        <div className="bss-pagination_wrapper mt-5 flex justify-end">
            <ul className="pagination-banner flex items-center">
                {
                    <li className="pagination-banner-item border border-gray-700 h-full  w-7 block m-auto cursor-pointer">
                        <a className="btn-next-prev flex justify-center items-center h-full" onClick={() => goToPrev()}>
                            <MdChevronLeft/>
                        </a>
                    </li>
                }
                { renderPages(pageNumbers.length, currentPage) }
                {
                    <li className="pagination-banner-item border-y border-r border-gray-700 h-full w-7 block cursor-pointer">
                        <a className="btn-next-prev flex justify-center items-center h-full" onClick={() => goToNext()}>
                            <MdChevronRight/>     
                        </a>
                    </li>
                }
            </ul>
        </div>
    )
}   