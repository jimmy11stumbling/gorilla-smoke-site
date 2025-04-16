import React from 'react';

// Simple admin implementation with no hooks or dependencies at all
export default function AdminPlain() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        marginBottom: '20px' 
      }}>
        <div style={{ 
          backgroundColor: '#0070f3', 
          color: 'white', 
          padding: '16px 24px' 
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Admin Panel</h1>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{
            backgroundColor: '#fff9e6',
            border: '1px solid #ffe58f',
            borderLeft: '4px solid #faad14',
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '4px'
          }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: '#875800' }}>Admin Information</p>
            <p style={{ margin: '0', fontSize: '14px', color: '#875800' }}>This is a simplified admin panel to demonstrate the core features.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#606060', fontWeight: '500' }}>Total Leads</span>
                <span style={{ 
                  backgroundColor: '#e6f7ff', 
                  color: '#1890ff', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '50%' 
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="#1890ff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#1890ff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M23 21V19C22.9986 17.1771 21.7033 15.5857 19.91 15.13" stroke="#1890ff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 3.13C17.7934 3.58605 19.0886 5.17759 19.09 7.00005C19.0886 8.82252 17.7934 10.4141 16 10.87" stroke="#1890ff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>285</p>
              <p style={{ 
                fontSize: '12px', 
                color: '#52c41a', 
                display: 'flex', 
                alignItems: 'center', 
                margin: 0 
              }}>
                <span style={{ marginRight: '4px' }}>▲</span>
                +12% from previous month
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#606060', fontWeight: '500' }}>Contact Messages</span>
                <span style={{ 
                  backgroundColor: '#f6effb', 
                  color: '#722ed1', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '50%' 
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#722ed1" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#722ed1" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>178</p>
              <p style={{ 
                fontSize: '12px', 
                color: '#52c41a', 
                display: 'flex', 
                alignItems: 'center', 
                margin: 0 
              }}>
                <span style={{ marginRight: '4px' }}>▲</span>
                +5% from previous month
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#606060', fontWeight: '500' }}>Menu Items</span>
                <span style={{ 
                  backgroundColor: '#e6f9f0', 
                  color: '#13c2c2', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '50%' 
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20" stroke="#13c2c2" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 7C3 5.89543 3.89543 5 5 5H9.5C10.6046 5 11.5 5.89543 11.5 7V9C11.5 10.1046 10.6046 11 9.5 11H5C3.89543 11 3 10.1046 3 9V7Z" stroke="#13c2c2" strokeWidth="2"/>
                    <path d="M12.5 7C12.5 5.89543 13.3954 5 14.5 5H19C20.1046 5 21 5.89543 21 7V9C21 10.1046 20.1046 11 19 11H14.5C13.3954 11 12.5 10.1046 12.5 9V7Z" stroke="#13c2c2" strokeWidth="2"/>
                    <path d="M3 15C3 13.8954 3.89543 13 5 13H9.5C10.6046 13 11.5 13.8954 11.5 15V17C11.5 18.1046 10.6046 19 9.5 19H5C3.89543 19 3 18.1046 3 17V15Z" stroke="#13c2c2" strokeWidth="2"/>
                    <path d="M12.5 15C12.5 13.8954 13.3954 13 14.5 13H19C20.1046 13 21 13.8954 21 15V17C21 18.1046 20.1046 19 19 19H14.5C13.3954 19 12.5 18.1046 12.5 17V15Z" stroke="#13c2c2" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>45</p>
              <p style={{ 
                fontSize: '12px', 
                color: '#606060', 
                margin: 0 
              }}>
                Across 5 categories
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#606060', fontWeight: '500' }}>Top Delivery Service</span>
                <span style={{ 
                  backgroundColor: '#fff2e6', 
                  color: '#fa8c16', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '50%' 
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 20C10.9 20 10 19.1 10 18C10 16.9 10.9 16 12 16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18 8C16.9 8 16 7.1 16 6C16 4.9 16.9 4 18 4C19.1 4 20 4.9 20 6C20 7.1 19.1 8 18 8Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18 14C16.9 14 16 13.1 16 12C16 10.9 16.9 10 18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18 20C16.9 20 16 19.1 16 18C16 16.9 16.9 16 18 16C19.1 16 20 16.9 20 18C20 19.1 19.1 20 18 20Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 14C4.9 14 4 13.1 4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" stroke="#fa8c16" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>UberEats</p>
              <p style={{ 
                fontSize: '12px', 
                color: '#606060', 
                margin: 0 
              }}>
                45% of all delivery orders
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
              <button style={{ 
                backgroundColor: '#0070f3', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Overview
              </button>
              <button style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#606060', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Leads
              </button>
              <button style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#606060', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Services
              </button>
            </div>
            
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '24px', 
              backgroundColor: 'white' 
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Monthly Performance</h3>
              <p style={{ fontSize: '14px', color: '#606060', margin: '0 0 24px 0' }}>Lead and contact form submissions over time</p>
              
              <div style={{ 
                height: '240px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '2px dashed #e0e0e0', 
                borderRadius: '4px', 
                padding: '24px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" stroke="#a0a0a0" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 16px' }}>
                    <path d="M12 20V10M18 20V4M6 20v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 8px 0', color: '#606060' }}>Chart Placeholder</h4>
                  <p style={{ fontSize: '14px', color: '#909090', margin: 0 }}>This would display a bar chart showing lead and contact submissions over time.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#f5f5f5'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>Recent Leads</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0', fontSize: '14px' }}>John Smith</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#606060' }}>john@example.com</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 8px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '10px',
                      color: '#606060'
                    }}>
                      Del Mar
                    </span>
                    <button style={{ 
                      border: 'none', 
                      background: 'none', 
                      color: '#0070f3',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0', fontSize: '14px' }}>Emily Johnson</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#606060' }}>emily@example.com</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 8px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '10px',
                      color: '#606060'
                    }}>
                      Zapata
                    </span>
                    <button style={{ 
                      border: 'none', 
                      background: 'none', 
                      color: '#0070f3',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0', fontSize: '14px' }}>Michael Brown</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#606060' }}>michael@example.com</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 8px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '10px',
                      color: '#606060'
                    }}>
                      San Bernardo
                    </span>
                    <button style={{ 
                      border: 'none', 
                      background: 'none', 
                      color: '#0070f3',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                  </div>
                </div>
              </div>
              
              <button style={{ 
                width: '100%', 
                padding: '8px', 
                backgroundColor: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                color: '#606060',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                View All Leads
              </button>
            </div>
            
            <div style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#f5f5f5'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>Recent Messages</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0', fontSize: '14px' }}>Sarah Wilson</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#606060' }}>Catering Inquiry</p>
                  </div>
                  <button style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: '#0070f3',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    View
                  </button>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0', fontSize: '14px' }}>Robert Davis</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#606060' }}>Reservation Question</p>
                  </div>
                  <button style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: '#0070f3',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    View
                  </button>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', margin: '0 0 4px 0', fontSize: '14px' }}>Jennifer Garcia</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#606060' }}>Feedback</p>
                  </div>
                  <button style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: '#0070f3',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    View
                  </button>
                </div>
              </div>
              
              <button style={{ 
                width: '100%', 
                padding: '8px', 
                backgroundColor: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                color: '#606060',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                View All Messages
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a href="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: '#0070f3', 
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          gap: '6px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Return to Website
        </a>
      </div>
    </div>
  );
}