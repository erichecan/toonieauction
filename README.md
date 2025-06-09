# Toonie Auction

A Shopify theme customization project that enhances the auction functionality and user experience for the Toonie Auction platform.

## 🎯 Project Overview

This repository contains customizations for a Shopify theme that integrates auction functionality, including:

- **Mobile-responsive auction components** with optimized styling
- **Custom CSS for auction app integration** with proper theming
- **Enhanced mobile header** with improved navigation
- **TikTok video integration** with responsive grid layouts
- **Image banner sections** with mobile-specific image support

## ✨ Features

### Auction Integration
- Custom CSS styling for auction app components
- Responsive countdown timers with mobile optimization
- Price display optimization for mobile devices
- Auction state indicators (ending soon, new auctions)

### Mobile Experience
- Enhanced mobile header with improved navigation
- Mobile-specific logo handling
- Responsive menu system with smooth animations
- Touch-friendly interface elements

### Content Management
- TikTok video sections with responsive grid layouts
- Image banner sections with desktop/mobile image support
- Custom promotional content sections

## 🛠️ Installation

### Prerequisites
- Shopify store with theme editing access
- Basic knowledge of Liquid templating
- Understanding of Shopify theme structure

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/toonieauction.git
   cd toonieauction
   ```

2. **Upload to Shopify**
   - Copy the relevant files to your Shopify theme
   - Ensure `assets/toonie-auction-app.css` is included in your theme
   - Update `layout/theme.liquid` to include the CSS file

3. **Configure Theme Settings**
   - Access your Shopify admin panel
   - Go to Online Store > Themes
   - Customize the theme settings as needed

## 📁 File Structure

```
toonieauction/
├── assets/
│   └── toonie-auction-app.css    # Main auction styling
├── sections/
│   ├── header.liquid             # Enhanced mobile header
│   └── image-banner.liquid       # Mobile-responsive image banners
├── layout/
│   └── theme.liquid              # Theme layout (needs CSS inclusion)
├── package.json                  # Node.js dependencies
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## 🎨 Customization

### CSS Styling
The main styling is in `assets/toonie-auction-app.css` with the following sections:

- **Auction Container**: Base auction component styling
- **Price Section**: Price display and bid information
- **Countdown Timer**: Responsive countdown styling
- **Mobile Header**: Enhanced mobile navigation
- **Responsive Design**: Mobile-first responsive breakpoints

### Theme Integration
To integrate the auction CSS into your theme:

1. Add to `layout/theme.liquid`:
   ```liquid
   {{ 'toonie-auction-app.css' | asset_url | stylesheet_tag }}
   ```

2. Customize colors and styling using CSS variables:
   ```css
   --toonie-auction-primary-color: #111827;
   --toonie-auction-secondary-color: #6b7280;
   ```

## 📱 Mobile Optimization

### Header Enhancements
- Fixed mobile header with improved navigation
- Touch-friendly menu interactions
- Optimized logo display for mobile devices
- Smooth menu animations and transitions

### Auction Components
- Compact countdown timers for mobile screens
- Single-line price displays
- Responsive grid layouts
- Touch-optimized interaction areas

## 🔧 Development

### Local Development
```bash
# Install dependencies
npm install

# For Python tools
pip install -r requirements.txt
```

### Testing
- Test on various mobile devices and screen sizes
- Verify auction functionality across different browsers
- Check responsive behavior on tablets and desktops

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check Shopify documentation for theme customization

## 🔄 Version History

- **v1.0.0**: Initial release with auction integration and mobile optimizations
- Enhanced mobile header with improved navigation
- Responsive auction components
- TikTok video integration
- Mobile-specific image banner support

---

**Note**: This project is specifically designed for Shopify themes and requires proper theme integration for full functionality. 