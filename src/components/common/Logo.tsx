import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, style = {} }) => {
  return (
    <div style={{ 
      height: 64, 
      margin: '16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      ...style
    }}>
      <div style={{
        color: '#fff',
        fontSize: collapsed ? '16px' : '20px',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: '1px',
        transition: 'all 0.3s ease'
      }}>
        {collapsed ? 'SB' : 'SBOOK-ADMIN'}
      </div>
    </div>
  );
};

export default Logo;