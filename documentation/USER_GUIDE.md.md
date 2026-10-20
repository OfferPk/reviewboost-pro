# ReviewBoost Pro — User Guide & Deployment Manual

Welcome to **ReviewBoost Pro**, your automated review growth engine and countertop QR stand generator.

---

## 1\. Quick Start

### 1.1 Running the Visual Studio

1. Open `source-code/index.html` in any web browser (Chrome, Safari, Edge, Firefox).  
2. The interactive studio will load immediately without any web server or database dependencies.  
3. Switch between **Printable Counter Stand** and **Mobile Funnel Simulator** using the top tab bar to preview your setup in real-time.

### 1.2 Using the Automation CLI

Ensure Python 3.8+ is installed on your workstation:

\# Validate your business configuration file

python3 build/reviewboost-cli.py \--input source-code/templates/uae-luxury-clinic.json \--validate

\# Generate a ready-to-print vector SVG countertop card

python3 build/reviewboost-cli.py \--input source-code/templates/uk-craft-restaurant.json \--output-svg restaurant-stand.svg

\# Generate a standalone mobile review funnel HTML file

python3 build/reviewboost-cli.py \--input source-code/templates/us-hvac-services.json \--output-html hvac-funnel.html

---

## 2\. Locating Your Direct Google Review Link (Place ID)

To ensure customers bypass the Google search results page and land directly on the 5-star review submission dialog:

1. Go to Google Maps and search for your business name and address.  
2. If you manage the Google Business Profile, go to your Google Search manager dashboard and click **Ask for reviews**.  
3. Copy the short link (e.g., `https://g.page/r/.../review` or `https://search.google.com/local/writereview?placeid=ChIJ...`).  
4. Paste this link into the **Public Review Destination URL** field in ReviewBoost Pro.

---

## 3\. Printing Countertop Acrylic Stands

For professional in-store presentation (front desk, dining table, reception counter):

1. Select your target card size (4x6 inches or 5x7 inches).  
2. Click **Print QR Stand** (or press `Ctrl+P` / `Cmd+P`).  
3. Set your printer settings:  
   - **Destination**: Printer or `Save as PDF`.  
   - **Paper Size**: 4x6" Photo Paper or Letter/A4 cardstock.  
   - **Scale**: 100% (Actual Size).  
   - **Background Graphics**: Checked.  
4. Insert the printed card into standard clear T-shape acrylic countertop sign holders available on Amazon or office supply stores for under \$3 each.

---

## 4\. Hosting the Mobile Review Funnel

When customers scan the QR code, you can point them to:

- A custom domain or free hosting page (e.g., GitHub Pages, Cloudflare Pages, Netlify) by uploading the HTML generated from `reviewboost-cli.py --output-html index.html`.  
- Or directly to your Google Review URL if you wish to bypass the sentiment rating gate.