# Progressive Web App (PWA) Documentation

This directory contains the PWA implementation for GameBet, enabling the application to be installed on devices and work offline.

## 📁 Files Overview

- **`manifest.json`** - PWA manifest file defining app metadata, icons, and display settings
- **`sw.js`** - Service Worker implementing cache-first strategy and offline support
- **`index.html`** - Main application entry point with PWA integration
- **`icons/`** - Application icons for different platforms and sizes
  - `icon-192.svg` - 192x192 icon (placeholder SVG)
  - `icon-512.svg` - 512x512 icon (placeholder SVG)

## 🎨 Replacing Icons

The current icons are placeholder SVG files. For production deployment:

### Steps to Replace Icons:

1. **Create Professional Icons**
   - Use design tools like Figma, Inkscape, Adobe Illustrator, or online services like [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Design a square icon with your brand identity
   - Ensure the design works well at small sizes

2. **Export as PNG Files**
   ```
   - icon-192.png (192x192 pixels)
   - icon-512.png (512x512 pixels)
   ```
   - Use PNG format for better browser compatibility
   - Ensure transparent background or solid color background matching your theme

3. **Update manifest.json**
   Replace the icon entries in `manifest.json`:
   ```json
   "icons": [
     {
       "src": "/icons/icon-192.png",
       "type": "image/png",
       "sizes": "192x192",
       "purpose": "any maskable"
     },
     {
       "src": "/icons/icon-512.png",
       "type": "image/png",
       "sizes": "512x512",
       "purpose": "any maskable"
     }
   ]
   ```

4. **Update index.html**
   Update the icon references:
   ```html
   <link rel="apple-touch-icon" href="/icons/icon-192.png">
   <link rel="icon" type="image/png" href="/icons/icon-192.png">
   ```

5. **Test Icons**
   - Clear browser cache
   - Reload the application
   - Test the install prompt
   - Verify icons appear correctly in the browser tab, home screen, and app switcher

## 🧪 Testing PWA Locally

### Prerequisites
- **HTTPS Required**: Service Workers only work over HTTPS (or localhost for development)
- Modern browser with PWA support (Chrome, Edge, Safari, Firefox)

### Local Testing Steps:

1. **Start a Local Server**
   
   Using Node.js:
   ```bash
   # Using http-server (install globally if needed: npm install -g http-server)
   cd public
   http-server -p 8080
   ```
   
   Or using Python:
   ```bash
   cd public
   python -m http.server 8080
   ```
   
   Or using the project's built-in server:
   ```bash
   npm start
   # Note: Configure server to serve from public/ directory if needed
   ```

2. **Open in Browser**
   ```
   http://localhost:8080
   ```

3. **Open Developer Tools**
   - Press `F12` or right-click → Inspect
   - Go to "Application" tab (Chrome/Edge) or "Storage" tab (Firefox)

4. **Check Service Worker**
   - Navigate to "Service Workers" section
   - Verify the service worker is registered and active
   - Status should show "activated and is running"

5. **Test Offline Mode**
   - In Developer Tools, go to "Network" tab
   - Check "Offline" checkbox
   - Reload the page
   - The offline fallback page should appear

6. **Test Caching**
   - Navigate through the site while online
   - Go offline using Developer Tools
   - Try accessing cached pages - they should load

7. **Test Install Prompt**
   - Look for install prompt in the page (if supported)
   - Or use browser's install option (usually in address bar or menu)
   - Install the app and verify it appears on your home screen/app list

### Testing Checklist:
- [ ] Service Worker registers successfully
- [ ] Manifest loads without errors
- [ ] Icons display correctly
- [ ] Offline fallback page works
- [ ] Cache-first strategy works (check Network tab for cached responses)
- [ ] Install prompt appears and works
- [ ] App installs and launches as standalone
- [ ] Theme color applies to browser UI

## 🔒 HTTPS Requirement

### Why HTTPS is Required:
- **Security**: Service Workers can intercept network requests, so they require HTTPS to prevent man-in-the-middle attacks
- **Privacy**: Ensures user data and cached content are transmitted securely
- **Standard Compliance**: PWA specification mandates HTTPS for service worker registration

### Exceptions:
- **localhost** - Service Workers work on `localhost` for development (HTTP is fine)
- **127.0.0.1** - Also works for local development

### Production Deployment:

1. **Get an SSL Certificate**
   - Use [Let's Encrypt](https://letsencrypt.org/) for free certificates
   - Or use your hosting provider's SSL certificate
   - Or use Cloudflare for free SSL proxy

2. **Configure Your Server**
   - Enable HTTPS on your web server (Apache, Nginx, etc.)
   - Redirect all HTTP traffic to HTTPS
   - Configure HSTS headers for enhanced security

3. **Update URLs in Service Worker**
   - Ensure all cached URLs use HTTPS
   - Update `start_url` in manifest.json if needed

4. **Test on Production**
   - Verify SSL certificate is valid
   - Check for mixed content warnings
   - Test service worker registration on production domain

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Replace placeholder SVG icons with professional PNG icons
- [ ] Update `manifest.json` with correct app name, description, and colors
- [ ] Ensure HTTPS is properly configured
- [ ] Test service worker on production domain
- [ ] Verify icons appear correctly across all devices
- [ ] Test offline functionality
- [ ] Test install flow on mobile devices
- [ ] Configure proper cache expiration strategies
- [ ] Add analytics to track PWA usage (optional)
- [ ] Test on multiple browsers (Chrome, Safari, Firefox, Edge)
- [ ] Verify Web App Manifest validation using [PWA Builder](https://www.pwabuilder.com/)

## 📊 PWA Auditing Tools

Use these tools to audit your PWA:

1. **Lighthouse** (built into Chrome DevTools)
   - Open DevTools → Lighthouse tab
   - Run PWA audit
   - Address any issues identified

2. **PWA Builder**
   - Visit [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
   - Enter your URL
   - Get detailed PWA report and recommendations

3. **Chrome DevTools Application Tab**
   - Check manifest
   - View service worker status
   - Inspect cache storage
   - Test offline mode

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Verify `sw.js` is accessible at `/sw.js`
- Ensure HTTPS or localhost
- Clear browser cache and reload

### Install Prompt Not Appearing
- Verify manifest.json is valid
- Check that icons are accessible
- Ensure `display: "standalone"` in manifest
- Some browsers require manual installation (Safari, Firefox)
- Try using different browser (Chrome has best PWA support)

### Offline Mode Not Working
- Check service worker is active
- Verify fetch event handler is working
- Check cache storage in DevTools
- Ensure assets are being cached correctly

### Icons Not Displaying
- Verify icon paths in manifest.json
- Check icon files are accessible
- Clear browser cache
- Ensure correct MIME types (image/png, image/svg+xml)

## 📚 Additional Resources

- [MDN Web Docs - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Builder](https://www.pwabuilder.com/)

## 💡 Tips

- **Development**: Use DevTools to bypass service worker cache during development
- **Testing**: Test on real devices, not just browser DevTools device emulation
- **Updates**: Implement proper versioning strategy for service worker updates
- **Performance**: Monitor cache size and implement cache cleanup strategies
- **Analytics**: Track PWA installation rates and usage patterns

---

**Note**: This PWA implementation uses a cache-first strategy which is ideal for static content. Adjust the caching strategy based on your application's needs (network-first for dynamic content, cache-first for static assets).

