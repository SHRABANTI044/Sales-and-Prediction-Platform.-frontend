import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { inventoryAPI, connectSocket } from './services/api';

const Inventory = ({ onNavigate, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Low Stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStockFilter, setSelectedStockFilter] = useState('All');
  const [selectedProfitFilter, setSelectedProfitFilter] = useState('All');
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [updateIndicator, setUpdateIndicator] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 25,
    lowStockAlerts: 8,
    outOfStock: 3,
    deadStock: 2,
    totalInventoryValue: 2847500,
    totalProfitValue: 456750,
    averageProfitMargin: 16.04,
    highProfitItems: 12,
    lowProfitItems: 5,
    negativeProfitItems: 2,
    products: [
      {
        id: 1,
        name: 'Rice Bag (5 KG)',
        sku: 'SKU-RICE001',
        category: 'Food & Beverages',
        stock: 45,
        costPrice: 180,
        sellingPrice: 220,
        profit: 40,
        profitMargin: 22.2,
        totalValue: 8100,
        totalProfit: 1800,
        reorderLevel: 20,
        soldThisMonth: 85,
        averageSalesPerDay: 2.8,
        fastMoving: true,
        status: 'In Stock'
      },
      {
        id: 2,
        name: 'Milk Packet (1 Liter)',
        sku: 'SKU-MILK001',
        category: 'Food & Beverages',
        stock: 12,
        costPrice: 45,
        sellingPrice: 50,
        profit: 5,
        profitMargin: 11.1,
        totalValue: 540,
        totalProfit: 60,
        reorderLevel: 20,
        soldThisMonth: 150,
        averageSalesPerDay: 5.0,
        fastMoving: true,
        status: 'Low Stock'
      },
      {
        id: 3,
        name: 'Sugar Pack (1 KG)',
        sku: 'SKU-SUGAR001',
        category: 'Food & Beverages',
        stock: 0,
        costPrice: 35,
        sellingPrice: 42,
        profit: 7,
        profitMargin: 20.0,
        totalValue: 0,
        totalProfit: 0,
        reorderLevel: 15,
        soldThisMonth: 95,
        averageSalesPerDay: 3.2,
        fastMoving: true,
        status: 'Out of Stock'
      },
      {
        id: 4,
        name: 'Wheat Flour (5 KG)',
        sku: 'SKU-WHEAT001',
        category: 'Food & Beverages',
        stock: 8,
        costPrice: 160,
        sellingPrice: 185,
        profit: 25,
        profitMargin: 15.6,
        totalValue: 1280,
        totalProfit: 200,
        reorderLevel: 25,
        soldThisMonth: 65,
        averageSalesPerDay: 2.2,
        fastMoving: false,
        status: 'Low Stock'
      },
      {
        id: 5,
        name: 'Cooking Oil (1 Liter)',
        sku: 'SKU-OIL001',
        category: 'Food & Beverages',
        stock: 12,
        costPrice: 120,
        sellingPrice: 140,
        profit: 20,
        profitMargin: 16.7,
        totalValue: 1440,
        totalProfit: 240,
        reorderLevel: 30,
        soldThisMonth: 78,
        averageSalesPerDay: 2.6,
        fastMoving: false,
        status: 'Low Stock'
      },
      {
        id: 6,
        name: 'Tea Pack (250g)',
        sku: 'SKU-TEA001',
        category: 'Food & Beverages',
        stock: 5,
        costPrice: 80,
        sellingPrice: 95,
        profit: 15,
        profitMargin: 18.8,
        totalValue: 400,
        totalProfit: 75,
        reorderLevel: 20,
        soldThisMonth: 45,
        averageSalesPerDay: 1.5,
        fastMoving: false,
        status: 'Low Stock'
      },
      {
        id: 7,
        name: 'Banana (Per Dozen)',
        sku: 'SKU-BANANA001',
        category: 'Food & Beverages',
        stock: 25,
        costPrice: 25,
        sellingPrice: 30,
        profit: 5,
        profitMargin: 20.0,
        totalValue: 625,
        totalProfit: 125,
        reorderLevel: 15,
        soldThisMonth: 120,
        averageSalesPerDay: 4.0,
        fastMoving: true,
        status: 'In Stock'
      },
      {
        id: 8,
        name: 'Bread Loaf (White)',
        sku: 'SKU-BREAD001',
        category: 'Food & Beverages',
        stock: 18,
        costPrice: 20,
        sellingPrice: 25,
        profit: 5,
        profitMargin: 25.0,
        totalValue: 360,
        totalProfit: 90,
        reorderLevel: 10,
        soldThisMonth: 110,
        averageSalesPerDay: 3.7,
        fastMoving: true,
        status: 'In Stock'
      },
      {
        id: 9,
        name: 'Tomato Pack (1 KG)',
        sku: 'SKU-TOMATO001',
        category: 'Food & Beverages',
        stock: 22,
        costPrice: 50,
        sellingPrice: 60,
        profit: 10,
        profitMargin: 20.0,
        totalValue: 1100,
        totalProfit: 220,
        reorderLevel: 15,
        soldThisMonth: 95,
        averageSalesPerDay: 3.2,
        fastMoving: true,
        status: 'In Stock'
      },
      {
        id: 10,
        name: 'Onion Bag (2 KG)',
        sku: 'SKU-ONION001',
        category: 'Food & Beverages',
        stock: 15,
        costPrice: 30,
        sellingPrice: 35,
        profit: 5,
        profitMargin: 16.7,
        totalValue: 450,
        totalProfit: 75,
        reorderLevel: 20,
        soldThisMonth: 85,
        averageSalesPerDay: 2.8,
        fastMoving: false,
        status: 'Low Stock'
      }
    ]
  });

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Load real data in background without showing loading
    loadInventoryDataInBackground();

    // Listen for real-time inventory updates
    socket.on('inventoryUpdate', (data) => {
      console.log('Real-time inventory update received:', data);
      if (data && typeof data === 'object' && data.products && data.products.length > 0) {
        setInventoryData(prevData => {
          console.log('Updating inventory data from:', prevData.totalProducts, 'to:', data.totalProducts);
          console.log('Products count from:', prevData.products?.length, 'to:', data.products?.length);
          
          // Show update indicator
          setUpdateIndicator(true);
          setLastUpdateTime(new Date());
          setTimeout(() => setUpdateIndicator(false), 2000);
          
          return {
            ...prevData,
            ...data,
            products: data.products || prevData.products
          };
        });
      } else {
        console.log('Received empty inventory update, keeping current data');
      }
    });

    // Listen for CSV upload updates
    socket.on('salesDataUploaded', (data) => {
      console.log('CSV data uploaded, refreshing inventory:', data);
      loadInventoryDataInBackground();
    });

    // Listen for dashboard updates (which also affect inventory)
    socket.on('dashboardUpdate', (data) => {
      console.log('Dashboard update received, may affect inventory');
      // Trigger inventory refresh when dashboard updates
      setTimeout(() => {
        loadInventoryDataInBackground();
      }, 1000);
    });

    return () => {
      socket.off('inventoryUpdate');
      socket.off('salesDataUploaded');
      socket.off('dashboardUpdate');
    };
  }, []);

  const loadInventoryDataInBackground = async () => {
    try {
      console.log('Loading inventory data from API in background...');
      const response = await inventoryAPI.getData();
      if (response.data.success && response.data.data && response.data.data.products && response.data.data.products.length > 0) {
        console.log('CSV inventory data loaded successfully:', {
          totalProducts: response.data.data.totalProducts,
          productsCount: response.data.data.products?.length,
          totalValue: response.data.data.totalInventoryValue
        });
        setInventoryData(response.data.data);
      } else {
        console.log('API returned empty data, keeping sample data');
        // Don't override sample data if API returns empty
      }
    } catch (error) {
      console.error('Error loading CSV inventory data in background:', error);
      // Keep the initial sample data if API fails - don't override
      console.log('Keeping initial sample data due to API error');
    }
  };

  // Advanced filtering logic - with safety checks
  const filteredProducts = (inventoryData.products || [])
    .filter(product => {
      // Safety check for product structure
      if (!product || !product.name) return false;
      
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.category || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Stock filter
      let matchesStock = true;
      if (selectedStockFilter !== 'All') {
        const stock = product.stock || 0;
        const reorderLevel = product.reorderLevel || 20;
        switch (selectedStockFilter) {
          case 'In Stock':
            matchesStock = stock > reorderLevel;
            break;
          case 'Low Stock':
            matchesStock = stock > 0 && stock <= reorderLevel;
            break;
          case 'Out of Stock':
            matchesStock = stock === 0;
            break;
          default:
            matchesStock = true;
        }
      }

      // Profit filter
      let matchesProfit = true;
      if (selectedProfitFilter !== 'All') {
        const margin = product.profitMargin || 0;
        switch (selectedProfitFilter) {
          case 'High Profit':
            matchesProfit = margin >= 20;
            break;
          case 'Good Profit':
            matchesProfit = margin >= 15 && margin < 20;
            break;
          case 'Medium Profit':
            matchesProfit = margin >= 10 && margin < 15;
            break;
          case 'Low Profit':
            matchesProfit = margin >= 5 && margin < 10;
            break;
          case 'Negative Profit':
            matchesProfit = margin < 5;
            break;
          default:
            matchesProfit = true;
        }
      }

      return matchesCategory && matchesSearch && matchesStock && matchesProfit;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Low Stock':
          return (a.stock || 0) - (b.stock || 0);
        case 'High Stock':
          return (b.stock || 0) - (a.stock || 0);
        case 'Price Low to High':
          return (a.sellingPrice || 0) - (b.sellingPrice || 0);
        case 'Price High to Low':
          return (b.sellingPrice || 0) - (a.sellingPrice || 0);
        case 'Profit High to Low':
          return (b.profitMargin || 0) - (a.profitMargin || 0);
        case 'Profit Low to High':
          return (a.profitMargin || 0) - (b.profitMargin || 0);
        case 'Name A-Z':
          return a.name.localeCompare(b.name);
        case 'Name Z-A':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Debug logging
  console.log('Inventory Debug:', {
    totalProducts: inventoryData.products?.length || 0,
    filteredProducts: filteredProducts.length,
    selectedCategory,
    selectedStockFilter,
    selectedProfitFilter,
    searchTerm,
    sampleProduct: inventoryData.products?.[0]
  });

  const getStockStatus = (stock, reorderLevel = 20) => {
    if (stock === 0) return { status: 'Out of Stock', class: 'out-of-stock', color: '#e53e3e' };
    if (stock <= reorderLevel) return { status: 'Low Stock', class: 'low-stock', color: '#dd6b20' };
    return { status: 'In Stock', class: 'in-stock', color: '#38a169' };
  };

  const getProfitStatus = (profitMargin) => {
    const margin = profitMargin || 0;
    if (margin >= 20) return { class: 'high-profit', icon: '🔥', label: 'High', color: '#38a169' };
    if (margin >= 15) return { class: 'good-profit', icon: '✅', label: 'Good', color: '#48bb78' };
    if (margin >= 10) return { class: 'medium-profit', icon: '⚠️', label: 'Medium', color: '#ed8936' };
    if (margin >= 5) return { class: 'low-profit', icon: '📉', label: 'Low', color: '#e53e3e' };
    return { class: 'negative-profit', icon: '❌', label: 'Negative', color: '#c53030' };
  };

  const getProductIcon = (category) => {
    switch (category) {
      case 'Food & Beverages': return '🍽️';
      case 'Health & Beauty': return '🧴';
      case 'Household': return '🏠';
      case 'Electronics': return '📱';
      case 'Accessories': return '🔌';
      case 'Clothing': return '👕';
      case 'Books': return '📚';
      case 'Sports': return '⚽';
      default: return '📦';
    }
  };

  // Generate categories dynamically from CSV data
  const categories = ['All Categories', ...new Set(inventoryData.products.map(p => p.category))];
  const sortOptions = ['Low Stock', 'High Stock', 'Price Low to High', 'Price High to Low', 'Profit High to Low', 'Profit Low to High', 'Name A-Z', 'Name Z-A'];
  const stockFilters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];
  const profitFilters = ['All', 'High Profit', 'Good Profit', 'Medium Profit', 'Low Profit', 'Negative Profit'];

  // Calculate additional metrics
  const totalValue = inventoryData.totalInventoryValue || 0;
  const totalProfit = inventoryData.totalProfitValue || 0;
  const avgMargin = inventoryData.averageProfitMargin || 0;
  const stockDistribution = {
    inStock: filteredProducts.filter(p => getStockStatus(p.stock, p.reorderLevel).class === 'in-stock').length,
    lowStock: filteredProducts.filter(p => getStockStatus(p.stock, p.reorderLevel).class === 'low-stock').length,
    outOfStock: filteredProducts.filter(p => getStockStatus(p.stock, p.reorderLevel).class === 'out-of-stock').length
  };

  const profitDistribution = {
    high: filteredProducts.filter(p => (p.profitMargin || 0) >= 20).length,
    good: filteredProducts.filter(p => (p.profitMargin || 0) >= 15 && (p.profitMargin || 0) < 20).length,
    medium: filteredProducts.filter(p => (p.profitMargin || 0) >= 10 && (p.profitMargin || 0) < 15).length,
    low: filteredProducts.filter(p => (p.profitMargin || 0) >= 5 && (p.profitMargin || 0) < 10).length,
    negative: filteredProducts.filter(p => (p.profitMargin || 0) < 5).length
  };

  // Remove the loading check - page will always render instantly
  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="mobile-logo">
          <span className="logo-icon">📦</span>
          <span>Inventory</span>
        </div>
        <div className="mobile-user">
          <span className="notification-badge">{inventoryData.lowStockAlerts}</span>
          <div className="user-avatar">👤</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📊</span>
            <div className="logo-text">
              <div className="logo-main">Sales Analytics</div>
              <div className="logo-sub">Real-time Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('dashboard');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item active">
            <span className="nav-icon">📦</span>
            <span className="nav-text">Inventory</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('alerts');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">🚨</span>
            <span className="nav-text">Alerts</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('analytics');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📈</span>
            <span className="nav-text">Sales Analytics</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('forecasting');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Forecasting</span>
          </div>
          <div className="nav-item" onClick={() => {
            onLogout && onLogout();
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">↩️</span>
            <span className="nav-text">Logout</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item">
            <span className="nav-icon">❓</span>
            <span className="nav-text">Help</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Inventory Management</h1>
            <p className="page-subtitle">
              Manage and track your product inventory • 
              <span className="csv-indicator"> 📄 CSV Data Source</span>
              {updateIndicator && (
                <span className="update-indicator" style={{
                  marginLeft: '10px',
                  padding: '2px 6px',
                  background: '#48bb78',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                  animation: 'pulse 1s ease-in-out'
                }}>
                  🔄 LIVE UPDATE
                </span>
              )}
            </p>
          </div>
          <div className="header-right">
            <div className="user-section">
              <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">Admin</span>
                  <span className="user-role">👤</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <div className="stat-number">{inventoryData.totalProducts || filteredProducts.length}</div>
                  <div className="stat-label">Total Products</div>
                  <div className="stat-change positive">+{filteredProducts.filter(p => p.fastMoving).length} Fast Moving</div>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">⚠️</div>
                <div className="stat-content">
                  <div className="stat-number">{inventoryData.lowStockAlerts || stockDistribution.lowStock}</div>
                  <div className="stat-label">Low Stock Alerts</div>
                  <div className="stat-change negative">Needs Attention</div>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">₹{((inventoryData.totalInventoryValue || totalValue) / 100000).toFixed(1)}L</div>
                  <div className="stat-label">Total Value</div>
                  <div className="stat-change positive">+₹{((inventoryData.totalProfitValue || totalProfit) / 1000).toFixed(0)}K Profit</div>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-number">{(inventoryData.averageProfitMargin || avgMargin).toFixed(1)}%</div>
                  <div className="stat-label">Avg Margin</div>
                  <div className="stat-change positive">{profitDistribution.high} High Profit Items</div>
                </div>
              </div>
            </div>
            
            {/* Last Update Indicator */}
            <div style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#718096',
              marginTop: '8px',
              marginBottom: '8px'
            }}>
              Last updated: {lastUpdateTime.toLocaleTimeString()} 
              {updateIndicator && <span style={{ color: '#48bb78', marginLeft: '5px' }}>● LIVE</span>}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="main-content-grid">
            {/* Inventory List - Full Width */}
            <div className="inventory-section">
              <div className="section-header">
                <h2 className="section-title">Product Inventory ({filteredProducts.length} items)</h2>
                <div className="section-actions">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-bar">
                <div className="search-input-container">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search products, SKU, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="inventory-list">
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock, product.reorderLevel);
                  const profitStatus = getProfitStatus(product.profitMargin);
                  
                  return (
                    <div key={product.id || index} className={`inventory-item ${stockStatus.class}`}>
                      <div className="item-left">
                        <div className="product-icon">{getProductIcon(product.category)}</div>
                        <div className="product-info">
                          <h3 className="product-name">{product.name}</h3>
                          <div className="product-details">
                            <span className="sku">SKU: {product.sku}</span>
                            <span className="category">{product.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="item-center">
                        <div className="stock-info">
                          <div className={`stock-level ${stockStatus.class}`}>
                            <span className="stock-number">{product.stock}</span>
                            <span className="stock-label">In Stock</span>
                          </div>
                          <div className="reorder-level">
                            Reorder at: {product.reorderLevel}
                          </div>
                        </div>
                        <div className="stock-info">
                          <div className="stock-level">
                            <span className="stock-number">{product.soldThisMonth || 0}</span>
                            <span className="stock-label">Sold This Month</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="item-right">
                        <div className="pricing-info">
                          <div className="price-row">
                            <span className="price-label">Cost Price</span>
                            <span className="price-value cost">₹{(product.costPrice || 0).toLocaleString()}</span>
                          </div>
                          <div className="price-row">
                            <span className="price-label">Selling Price</span>
                            <span className="price-value selling">₹{(product.sellingPrice || 0).toLocaleString()}</span>
                          </div>
                          <div className="price-row profit-row">
                            <span className="price-label">Profit Margin</span>
                            <span className="price-value profit">₹{product.profit || 0} ({(product.profitMargin || 0).toFixed(1)}%)</span>
                          </div>
                        </div>
                        
                        <div className={`profit-indicator ${profitStatus.class}`}>
                          <span className="profit-icon">{profitStatus.icon}</span>
                          <span className="profit-label">{profitStatus.label} Profit</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredProducts.length === 0 && (
                  <div className="empty-inventory">
                    <div className="empty-icon">📦</div>
                    <h3 className="empty-title">No products found</h3>
                    <p className="empty-subtitle">
                      {inventoryData.products.length === 0 
                        ? "No products loaded from CSV data. Please upload a CSV file."
                        : "Try adjusting your search or filters to find products."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inventory;
