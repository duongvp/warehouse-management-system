import React from "react";
import { MdArrowDropDown, MdArrowDropUp, MdBarChart, MdClass, MdContactPage, MdDocumentScanner, MdHome, MdLayers, MdLogout, MdManageAccounts, MdOutlineCategory, MdOutlineChecklist, MdOutlineDirectionsBus, MdOutlineLocalShipping, MdOutlineLockClock, MdOutlineMultipleStop, MdOutlinePeopleAlt, MdOutlineShoppingCart, MdShowChart, MdStorage, MdStoreMallDirectory, MdViewCompact } from "react-icons/md";

export const SidebarData = [
  {
    title: "Trang chủ",
    layout: "/admin",
    path: "/admin/default",
    icon: <MdHome className="h-6 w-6 mb-1" />
  },
  {
    title: "Dữ liệu sản phẩm",
    layout: "/admin",
    icon: <MdStorage className="h-6 w-6 mb-1" />,
    iconClosed: <MdArrowDropDown className="h-6 w-6" />,
    iconOpened: <MdArrowDropUp className="h-6 w-6" />,
    page: 'productData',
    subNav: [
      {
        title: "Sản phẩm",
        path: "/admin/product",
        icon: <MdOutlineShoppingCart className="h-5 w-5" />,
        page: 'product'
      },
      {
        title: "Đơn vị tính",
        path: "/admin/unit",
        icon: <MdClass className="h-5 w-5" />,
        page: 'unit'
      },
      {
        title: "Loại hàng",
        path: "/admin/category",
        icon: <MdOutlineCategory className="h-5 w-5" />,
        page: 'category'
      },
    ],
  },
  {
    title: "Đối tác",
    layout: "/admin",
    icon: <MdOutlinePeopleAlt className="h-6 w-6 mb-1" />,
    iconClosed: <MdArrowDropDown className="h-6 w-6" />,
    iconOpened: <MdArrowDropUp className="h-6 w-6" />,
    page: 'partner',
    subNav: [
      {
        title: "Khách hàng",
        path: "/admin/customer",
        icon: <MdContactPage className="h-5 w-5" />,
        page: 'customer'
      },
      {
        title: "Nhà cung cấp",
        path: "/admin/supplier",
        icon: <MdOutlineDirectionsBus className="h-6 w-6" />,
        page: 'supplier'
      },
    ],
  },
  {
    title: "Giao dịch",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6 mb-1" />,
    iconClosed: <MdArrowDropDown className="h-6 w-6" />,
    iconOpened: <MdArrowDropUp className="h-6 w-6" />,
    page: 'transaction',
    subNav: [
      {
        title: "Phiếu nhập hàng",
        path: "/admin/inventory-receiving-voucher",
        icon: <MdStoreMallDirectory className="h-5 w-5" />,
        page: 'receiving'
      },
      {
        title: "Phiếu xuất hàng",
        path: "/admin/inventory-delivery-note",
        icon: <MdOutlineLocalShipping className="h-5 w-5" />,
        page: 'delivery'
      },
      // {
      //   title: "Chuyển kho",
      //   path: "/admin/b2",
      //   icon: <MdOutlineMultipleStop className="h-6 w-6" />
      // },
      {
        title: "Kiểm kho",
        path: "/admin/inventory-inspection-voucher",
        icon: <MdOutlineChecklist className="h-6 w-6" />,
        page: 'inspection'
      },
      {
        title: "Quản lý kho",
        path: "/admin/warehouse",
        icon: <MdLayers className="h-6 w-6" />,
        page: 'inspection'
      },
    ],
  },
  {
    title: "Báo cáo",
    layout: "/admin",
    icon: <MdDocumentScanner className="h-6 w-6 mb-1" />,
    iconClosed: <MdArrowDropDown className="h-6 w-6" />,
    iconOpened: <MdArrowDropUp className="h-6 w-6" />,
    page: 'report',
    subNav: [
      {
        title: "Báo cáo doanh thu",
        path: "/admin/salesReport",
        icon: <MdShowChart className="h-5 w-5" />,
        page: 'salesReport'
      },
    ],
  },
  {
    title: "Quản trị viên",
    layout: "/admin",
    path: "/admin/administrators",
    icon: <MdManageAccounts className="h-6 w-6 mb-1" />,
    page: "administrators"
  },
  {
    title: "Vai trò thành viên",
    layout: "/admin",
    path: "/admin/member-role",
    icon: <MdOutlineLockClock className="h-6 w-6 mb-1" />,
    page: "role"
  },
  {
    title: "Đăng xuất",
    layout: "/auth",
    path: "/auth/sign-in",
    icon: <MdLogout className="h-5 w-6 mb-1" />
  }
];