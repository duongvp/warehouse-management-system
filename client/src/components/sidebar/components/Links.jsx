import React from "react";
import SubMenu from "./SubMenu";
import { useSelector } from "react-redux";
// chakra imports

export function SidebarLinks(props) {
 const userPermissions = useSelector(state => state.user.permissions);
 const { routes } = props;
  const createLinks = (routes) => {
    return routes.map((item, index) => {
      if (
        item.layout === "/admin" || item.layout === "/auth"
      ) {
        if (
          item?.page == 'partner' && !userPermissions.includes('viewCustomer') && !userPermissions.includes('viewSupplier') ||
          item?.page == 'transaction' && !userPermissions.includes('viewDelivery') && !userPermissions.includes('viewInspection')  && !userPermissions.includes('viewReceipt') ||
          item?.page == 'productData' && !userPermissions.includes('viewPro') && !userPermissions.includes('viewUnit')  && !userPermissions.includes('viewCategory') ||
          item?.page == 'report' && !userPermissions.includes('viewReport') ||
          item?.page == 'administrators' && !userPermissions.includes('viewUser') ||
          item?.page == 'role' && !userPermissions.includes('viewRole')   
        ) return
        return (
          <SubMenu item={item}  indexParent={index} />
        );
      }
    });
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;
