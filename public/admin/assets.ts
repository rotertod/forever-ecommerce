import logo from './logo.png';
import add_icon from './add_icon.png';
import order_icon from './order_icon.png';
import upload_area from './upload_area.png';
import parcel_icon from './parcel_icon.svg';

export const assets = {
    logo,
    add_icon,
    order_icon,
    upload_area,
    parcel_icon,
};

export const sidebarLinks = [
    { id: 1, label: 'Thêm sản phẩm', href: '/admin/add-product', icon: assets.add_icon },
    { id: 2, label: 'Các sản phẩm', href: '/admin/list-product', icon: assets.order_icon },
    { id: 3, label: 'Đơn hàng', href: '/admin/list-order', icon: assets.order_icon },
    { id: 4, label: 'Các kích cỡ', href: '/admin/list-size', icon: assets.order_icon },
];
