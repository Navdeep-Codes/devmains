# Devmains 🌍

![Badge](https://img.shields.io/badge/Devmains-Free_Subdomains-2ea44f?style=flat-square)

Welcome to **Devmains** — a service that gives you free subdomains like `yourname.is-open-source.org` and more!  
We aim to help developers easily get a free subdomain for their open-source projects.

---

## 🚀 How to Get a Free Subdomain

1. **Fork** this repo.
2. **Pick a domain folder** inside `/domains/` (example: `is-open-source.org/`).
3. **Create a `.json` file** with your subdomain request.
4. Use this format:

```json
{
  "subdomain": "yourname",
  "owner": {
    "repo": "https://github.com/yourgithubusername/yourrepository",
    "email": "youremail@example.com",
    "name": "Your Name"
  },
  "record": {
    "CNAME": "yourhosting.com"
  }
}
```

5. **Submit a Pull Request**.
6. **Wait for approval** — that's it!

---

## 📂 Folder Structure

```
/domains
   /is-open-source.org
      yourname.json
      anothername.json
   /future-domain.com
      yourname.json
```

- Each main domain (like `is-open-source.org`) has its own folder.
- Add your subdomain inside the correct domain folder.
- Later, more domains will be available!

---

## 📜 Rules and Notes

- **Subdomains** must have **5+ hrs on Hackatime/Wakatime**
- **The `is-open-source.org` subdomain is given for free** but the project must be a **open-source projects**.
- **Only CNAME or A records are allowed.**
- **TTL is set to Auto** (automatic adjustment based on Cloudflare).
- **DNS records are NOT proxied** (no Cloudflare proxy — direct DNS only).
- Make sure **your hosting** is ready to accept the domain.
- Do not request domains for malicious, harmful, illegal, or copyrighted content.
- Admins reserve the right to **deny requests** without explanation if necessary.

---

## 📄 License

MIT License © Devmains Team

---
