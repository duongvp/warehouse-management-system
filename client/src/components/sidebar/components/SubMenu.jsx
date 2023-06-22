import DashIcon from "components/icons/DashIcon";
import { logout } from "features/user/userSlice";
import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function SubMenu(props) {
  const userPermissions = useSelector(state => state.user.permissions);
  const dispatch = useDispatch()
  // Chakra color mode
    let location = useLocation();

    const { item, indexParent } = props;

    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName) => {
        return location.pathname.includes(routeName);
    };
    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);
    return (
        <>
          {item.path != '/auth/sign-in' ? (
            <Link to={item.path} key={`parent-${indexParent}`} onClick={item.subNav && showSubnav} className="flex justify-between items-center my-[5px] cursor-pointer px-5 py-1 list-none relative">
            <div className={`flex items-center relative hover:cursor-pointer w-full ${indexParent >=1 ? "mt-3" :""}`}>
              <span
                className={`${
                  (activeRoute(item.path) === true || (!item.path && item.subNav?.find((ele) => activeRoute(ele.path) === true)))
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {item.icon ? item.icon : <DashIcon />}{" "}
              </span>
              <p
                className={`leading-1 ml-2 flex ${
                  (activeRoute(item.path) === true || (!item.path && item.subNav?.find((ele) => activeRoute(ele.path) === true)))
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {item.title}
              </p>
              {activeRoute(item.path) ? (
                <div class="absolute -right-5 top-2px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
            <div className={`absolute right-[5px] top-[14px] font-medium ${(!item.path && item.subNav?.find((ele) => activeRoute(ele.path) === true)) ? "text-navy-700" : "text-gray-600" }`}>
              {item.subNav && subnav
                ? item.iconOpened
                : item.subNav
                ? item.iconClosed
                : null}
            </div>
          </Link>
          ) : (
            <p to={item.path} key={`parent-${indexParent}`} onClick={() => {dispatch(logout())}} className="flex justify-between items-center my-[5px] cursor-pointer px-5 py-1 list-none relative">
              <div className={`flex items-center relative hover:cursor-pointer w-full ${indexParent >=1 ? "mt-3" :""}`}>
                <span
                  className={`${
                    (activeRoute(item.path) === true || (!item.path && item.subNav?.find((ele) => activeRoute(ele.path) === true)))
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {item.icon ? item.icon : <DashIcon />}{" "}
                </span>
                <p
                  className={`leading-1 ml-2 flex ${
                    (activeRoute(item.path) === true || (!item.path && item.subNav?.find((ele) => activeRoute(ele.path) === true)))
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {item.title}
                </p>
                {activeRoute(item.path) ? (
                  <div class="absolute -right-5 top-2px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
          </p>
          )}
          {
            subnav &&
            item.subNav?.map((ele, index) => {
              if (
                  ele?.page == 'product' && !userPermissions.includes('viewPro') ||
                  ele?.page == 'unit' && !userPermissions.includes('viewUnit') ||
                  ele?.page == 'category' && !userPermissions.includes('viewCategory') ||
                  ele?.page == 'customer' && !userPermissions.includes('viewCustomer') ||
                  ele?.page == 'supplier' && !userPermissions.includes('viewSupplier') ||
                  ele?.page == 'receiving' && !userPermissions.includes('viewReceipt') ||
                  ele?.page == 'delivery' && !userPermissions.includes('viewDelivery') ||
                  ele?.page == 'inspection' && !userPermissions.includes('viewInspection') ||
                  ele?.page == 'salesReport' && !userPermissions.includes('viewReport')
              ) return;
              return (
                <Link to={ele.path}  key={index} className="flex items-center my-[3px] cursor-pointer pl-[45px] list-none relative pb-2">
                  <span
                    className={`${
                      activeRoute(ele.path) === true
                        ? "font-bold text-brand-500 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {ele.icon ? ele.icon : <DashIcon />}{" "}
                  </span>
                  <p
                    className={`leading-1 ml-2 flex ${
                      activeRoute(ele.path) === true
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {ele.title}
                  </p>
                  {activeRoute(ele.path) ? (
                  <div class="absolute right-0 top-2px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
                </Link>
              );
          })}
        </>
    );
}

