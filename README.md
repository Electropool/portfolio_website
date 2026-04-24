# Arpan Kar — Portfolio
## ElectroPool v2.1 | Dark Purple × Black

Vite + React + TypeScript + Tailwind CSS + Framer Motion

---

## 🚀 Quick Start (Antigravity / Local)

```bash
unzip portfolio.zip
cd portfolio
npm install
npm run dev
# http://localhost:5173
```

## 🏗️ Hosting on Oracle VPS (with Nginx)

Follow these step-by-step instructions to host this portfolio on your Oracle VPS using Nginx and a custom domain.

### Step 1: Build the Project Locally or on VPS
First, generate the production build.
```bash
# If on your VPS, navigate to the project directory:
cd /var/www/portfolio_website

# Install dependencies and build
npm install
npm run build
```
This will create a `dist/` folder containing the optimized static assets.

### Step 2: Install Nginx (if not already installed)
Connect to your VPS via SSH and install Nginx:
```bash
sudo apt update
sudo apt install nginx -y
```

### Step 3: Move Build Files to Nginx Root
Assuming you built the project at `/var/www/portfolio_website`, copy the contents of the `dist/` directory to the web root:
```bash
sudo mkdir -p /var/www/portfolio.yourdomain.com
sudo cp -r /var/www/portfolio_website/dist/* /var/www/portfolio.yourdomain.com/
sudo chown -R www-data:www-data /var/www/portfolio.yourdomain.com
sudo chmod -R 755 /var/www/portfolio.yourdomain.com
```

### Step 4: Configure Nginx
Create a new Nginx server block configuration for your domain:
```bash
sudo nano /etc/nginx/sites-available/portfolio.yourdomain.com
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com; # Replace with your domain

    root /var/www/portfolio.yourdomain.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        log_not_found off;
    }
}
```

Enable the site by creating a symlink to `sites-enabled`:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio.yourdomain.com /etc/nginx/sites-enabled/
```

Test the configuration for syntax errors and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Secure with SSL (Certbot)
To enable HTTPS, install Certbot and the Nginx plugin:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the prompts, and Certbot will automatically configure SSL for your site!

## 📁 Structure

```
src/
  components/
    Cursor.tsx
    ElectroPoolBackground.tsx   ← WebGL shader
    Footer.tsx
    LoadingScreen.tsx           ← boot sequence
    MediaLightbox.tsx           ← single-image viewer
    Navigation.tsx              ← 7-page HUD nav
    PageWrapper.tsx             ← slide transitions
    SocialDock.tsx              ← grouped social links
    StackedMediaViewer.tsx      ← multi-image stacked gallery
  pages/
    HomePage.tsx
    PersonalInfoPage.tsx        ← profile, skills, timeline
    ProjectsPage.tsx
    CertificationsPage.tsx      ← blurred cards + lightbox
    AchievementsPage.tsx        ← stacked photo gallery
    ContactsPage.tsx
    SocialsPage.tsx             ← all social links grouped

public/assets/
  photo.png         ← replace with your photo
  music.mp3         ← background music
  certs/            ← certificate images
  achievements/     ← achievement photos
```

## ✏️ Quick Customization

| What | File |
|---|---|
| Update projects | `src/pages/ProjectsPage.tsx` → `projects` array |
| Update social links | `src/components/SocialDock.tsx` → `SOCIALS` array |
| Update contact info | `src/pages/ContactsPage.tsx` → `contacts` array |
| Add certificates | `src/pages/CertificationsPage.tsx` → `CERTS` array |
| Add achievements | `src/pages/AchievementsPage.tsx` → `ACHIEVEMENTS` array |
| Replace photo | `public/assets/photo.png` |
| Replace music | `public/assets/music.mp3` |

## 🎨 Colors (src/index.css)
```css
--purple:        #7c3aed
--purple-light:  #a855f7
--accent:        #c084fc
--bg:            #050508
```
