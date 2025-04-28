# Devmains 🌍

![Badge](https://img.shields.io/badge/Devmains-Free_Subdomains-2ea44f?style=flat-square)

**Devmains** gives you free subdomains like `yourname.is-open-source.org` or other domains!

---

## 🚀 How to Get a Free Subdomain

1. **Fork** this repo.
2. **Pick a main domain** (example: `is-open-source.org`) inside `/domains/`.
3. **Create a file** inside that folder (example: `/domains/is-open-source.org/yourname.json`)
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
