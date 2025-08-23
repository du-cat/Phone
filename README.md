# Temporary KYC Website

Static site for carrier/telecom KYC validation hosted on GitHub Pages.

## Update placeholders
Search and replace these tokens in all files:
- `<COMPANY_NAME>`
- `<LEGAL_ENTITY_NAME>`
- `<ADDRESS_LINE_1>`, `<ADDRESS_LINE_2>`
- `<SUPPORT_EMAIL>`
- `<SUPPORT_PHONE>`
- `<OWNER_NAME>`
- `<YEAR>`
- `<DATE>`

## Publish on GitHub Pages
1. Create a repo (public is easiest).  
2. Push these files to the repo root (or upload via the web).  
3. Settings → Pages → Build & deployment → Source: *Deploy from a branch*.  
   - Branch: `main`  
   - Folder: `/` (root)  
4. Save. Your site will be live at:  
   - `https://<username>.github.io/<repo>` (project site) or  
   - `https://<username>.github.io` if you name the repo `<username>.github.io` (user site).
