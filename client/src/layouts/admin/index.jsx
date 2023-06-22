import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import { SidebarData } from "sidebarData";
import InventoryReceivingVoucher from "views/admin/transaction/inventoryReceivingVoucher";
import PurchaseOrder from "views/admin/transaction/purchaseOrder";
import CreateNewProduct from "views/admin/product/createNewProduct";
import InventoryDeliveryVoucher from "views/admin/transaction/inventoryDeliveryVoucher";
import CreateDeliveryVoucher from "views/admin/transaction/createDeliveryVoucher";
import ViewRole from "views/admin/roles/ViewRole";
import CreateNewRole from "views/admin/roles/CreateNewRole";
import ViewUser from "views/admin/user/ViewUser";
import CreateNewUser from "views/admin/user/CreateNewUser";
import ViewSupplier from "views/admin/supplier/ViewSupplier";
import CreateNewSupplier from "views/admin/supplier/CreateNewSupplier";
import ViewCustomer from "views/admin/customer/ViewCustomer";
import CreateNewCustomer from "views/admin/customer/CreateNewCustomer";
import ViewUnit from "views/admin/unit/ViewUnit";
import CreateNewUnit from "views/admin/unit/CreateNewUnit";
import ViewCategory from "views/admin/category/ViewCategory";
import CreateNewCategory from "views/admin/category/CreateNewCategory";
import InventoryInspectionVoucher from "views/admin/transaction/inventoryInspectionVoucher";
import CreateInspectionVoucher from "views/admin/transaction/createInspectionVoucher";
import SaleReport from "views/admin/report/SaleReport";
import { useSelector } from "react-redux";
import ViewWarehouse from "views/admin/warehouse/ViewWarehouse";
import CreateNewWh from "views/admin/warehouse/CreateNewWh";

export default function Admin(props) {
  const { ...rest } = props;
  const userPermissions = useSelector(state => state.user.permissions);
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const [parentCurrentRoute, setParentCurrentRoute] = React.useState("");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(SidebarData);
  }, [location.pathname]);

  const getActiveRoute = (SidebarData) => {
    let activeRoute = "Main Dashboard";
    let path = window.location.pathname;
    SidebarData.map((item) => {
      if(item.path && path.includes(item.path)) {
         setCurrentRoute(item.title);
         setParentCurrentRoute(item.title);
      } else if (item.subNav) {
        item.subNav?.find(ele => {
          if(path.includes(ele.path)) { 
            setCurrentRoute(ele.title);
            setParentCurrentRoute(item.title);
          };
        })
      }
    })
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              parentCurrentRoute ={parentCurrentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route path="product/create-new" element={<CreateNewProduct className="h-6 w-6" context="Thêm mới sản phẩm"/>}/>
                {userPermissions.includes('editPro') && (<Route path="product/edit/:proId" element={<CreateNewProduct className="h-6 w-6"  context="Sửa sản phẩm"/>}/>)}
                <Route path="/inventory-receiving-voucher/create-new" element={<PurchaseOrder className="h-6 w-6"  context="Thêm thông tin nhập hàng"/>}/>
                <Route path="/inventory-receiving-voucher/edit/:id" element={<PurchaseOrder className="h-6 w-6"  context="Thanh toán đơn nhập"/>}/>
                <Route path="/inventory-receiving-voucher" element={<InventoryReceivingVoucher className="h-6 w-6"  context="Phiếu nhập hàng"/>}/>
                <Route path="/inventory-inspection-voucher" element={<InventoryInspectionVoucher className="h-6 w-6" />}/>
                <Route path="/inventory-inspection-voucher/create-new" element={<CreateInspectionVoucher className="h-6 w-6"  context="Thêm thông tin phiếu kiểm kho"/>}/>
                <Route path="/inventory-inspection-voucher/edit/:id" element={<CreateInspectionVoucher className="h-6 w-6"  context="Xem chi tiết phiếu kiểm kho"/>}/>
                <Route path="/inventory-delivery-note" element={<InventoryDeliveryVoucher className="h-6 w-6"  context="Phiếu nhập hàng"/>}/>
                <Route path="/inventory-delivery-note/create-new" element={<CreateDeliveryVoucher className="h-6 w-6"  context="Thêm thông tin xuất hàng"/>}/>
                <Route path="/inventory-delivery-note/edit/:id" element={<CreateDeliveryVoucher className="h-6 w-6"  context="Thanh toán đơn xuất"/>}/>
                <Route path="/member-role" element={<ViewRole className="h-6 w-6"  context="Phiếu nhập hàng"/>}/>
                <Route path="/member-role/create-new" element={<CreateNewRole className="h-6 w-6"  context="Thêm mới vai trò"/>}/>
                <Route path="/member-role/edit/:roleId" element={<CreateNewRole className="h-6 w-6"  context="Sửa vai trò"/>}/>
                <Route path="/administrators" element={<ViewUser className="h-6 w-6"  context="Phiếu nhập hàng"/>}/>
                <Route path="/administrators/create-new" element={<CreateNewUser className="h-6 w-6"  context="Thêm mới người dùng"/>}/>
                <Route path="/administrators/edit/:userId" element={<CreateNewUser className="h-6 w-6"  context="Sửa thông tin người dùng"/>}/>
                <Route path="/supplier" element={<ViewSupplier className="h-6 w-6"  />}/>
                <Route path="/supplier/create-new" element={<CreateNewSupplier className="h-6 w-6"  context="Thêm mới nhà cung cấp"/>}/>
                <Route path="/supplier/edit/:supplierId" element={<CreateNewSupplier className="h-6 w-6"  context="Sửa thông tin nhà cung cấp"/>}/>
                <Route path="/customer" element={<ViewCustomer className="h-6 w-6"  />}/>
                <Route path="/customer/create-new" element={<CreateNewCustomer className="h-6 w-6"  context="Thêm mới khách hàng"/>}/>
                <Route path="/customer/edit/:customerId" element={<CreateNewCustomer className="h-6 w-6"  context="Sửa thông tin khách hàng"/>}/>
                <Route path="/unit" element={<ViewUnit className="h-6 w-6"  />}/>
                <Route path="/unit/create-new" element={<CreateNewUnit className="h-6 w-6"  context="Thêm mới đơn vị tính"/>}/>
                <Route path="/unit/edit/:unitId" element={<CreateNewUnit className="h-6 w-6"  context="Sửa thông đơn vị tính"/>}/>
                <Route path="/category" element={<ViewCategory className="h-6 w-6"  />}/>
                <Route path="/category/create-new" element={<CreateNewCategory className="h-6 w-6"  context="Thêm mới loại hàng"/>}/>
                <Route path="/category/edit/:unitId" element={<CreateNewCategory className="h-6 w-6"  context="Sửa thông tin loại hàng"/>}/>
                <Route path="/salesReport" element={<SaleReport className="h-6 w-6"  />}/>
                <Route path="/warehouse" element={<ViewWarehouse className="h-6 w-6"  />}/>
                <Route path="/warehouse/create-new" element={<CreateNewWh className="h-6 w-6"  context="Thêm mới kho hàng"/>}/>
                <Route path="/warehouse/edit/:id" element={<CreateNewWh className="h-6 w-6"  context="Sửa thông tin kho hàng"/>}/>
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
