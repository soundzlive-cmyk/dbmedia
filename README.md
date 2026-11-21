# BDB Media — website

Static website for **BDB Media**, a web & app development firm. Plain HTML, CSS and JavaScript — no build step. Upload the folder to any web host (or the web root on your Linux server) and it runs.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Homepage — hero, services, design samples, "Take Your Idea to the Masses", process, quote builder |
| `services.html` | All services in detail + process |
| `work.html` | Design samples with filters and preview lightbox |
| `contact.html` | Project quote builder + contact details |
| `404.html` | Not-found page |

Shared files: `css/styles.css`, `js/main.js`, `images/`.

## Before going live

- **Contact details:** replace `[YOUR EMAIL]`, `[YOUR PHONE]` and `[YOUR CITY]` in `index.html` and `contact.html`.
- **Quote form:** set `CONTACT_EMAIL` at the top of `js/main.js`. The form currently opens the visitor's email app with the project details filled in. To receive submissions without email apps, point it at a form service (Formspree, Netlify Forms, etc.) or your own endpoint.
- **404 page:** tell your web server to use `404.html` (Apache: `ErrorDocument 404 /404.html`; Nginx: `error_page 404 /404.html;`).

## Credits

- Photo in "Take Your Idea to the Masses": [Vitaly Gariev on Unsplash](https://unsplash.com/photos/woman-working-on-a-laptop-in-a-modern-office-WrlIRaC9t-A) (Unsplash License).
- Portfolio screenshots are of sites designed by BDB Media: patriceambroise.com, breakingthroughroadblocks.org, igotohim.com, 2shadytinting.com.
- Fonts: Space Grotesk and Inter via Google Fonts.
