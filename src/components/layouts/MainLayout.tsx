import { Outlet } from "react-router-dom";
import { logout } from '../../utils/logout';

const Content = () => {
  return (
    <div style={{ padding: 20, width: "100%" }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button 
          onClick={logout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#ff4d4f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Đăng xuất
        </button>
      </div>
      <Outlet /> {/* Nơi render trang con */}
    </div>
  );
};

export default Content;
