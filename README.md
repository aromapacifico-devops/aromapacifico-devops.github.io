# Aroma Pacifico site

Presentation site of the Aroma Pacifico platform, a coffee traceability pilot for 200 farms in Cauca, Huila and Tolima. One page walks through the journey of a sack, the architecture, the behavior with no signal, the infrastructure code, the cost, the design system and the evidence behind each claim.

The site is static. It reads no cloud service and holds no real data, and the sack codes, readings and names on the screens are examples.

## Run it

It needs Node.js 22 or later.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # writes dist/
```

A push to `main` builds the site and publishes it with GitHub Pages through `.github/workflows/deploy.yml`. The build uses a relative base, so it works on a custom domain and under a repository path.

## Layout

| Path | Content |
|---|---|
| `index.html` | Sections and static copy |
| `src/data.js` | Figures, lists and links that the page renders |
| `src/main.js` | Rendering, scroll animation and the interactive parts |
| `src/style.css` | Styles, built on the tokens of the visual identity |
| `public/img/diagrams/` | The 23 architecture diagrams as WebP |
| `public/img/screens/` | The screens of the farmer, carrier and buyer views |
| `public/brand/` | Logo and isotype |
| `scripts/assets.mjs` | Rebuilds every image from the documents repository |

The page uses Vite, GSAP with ScrollTrigger and Lenis. Outfit and Roboto Mono are bundled through Fontsource, so the site loads no font from another host.

## Where the content comes from

Every figure on the page comes from a document of the [documents repository](https://github.com/aromapacifico-devops/aromapacifico-devops-docs) or from the [verification](https://github.com/aromapacifico-devops/aromapacifico-devops-infra/blob/main/docs/verification.md) of the infrastructure code. When a figure changes there, change it in `src/data.js` or `index.html`.

| Section | Source |
|---|---|
| Journey, platform and failures | `docs/architecture/overview.md` |
| Outage demonstration | The store-and-forward rules of `docs/network/farm-connectivity.md` |
| Infrastructure code | `README.md` and `docs/verification.md` of the infrastructure repository |
| Cost | `docs/governance/pilot-cost.md` |
| Design | `docs/design/visual-identity.md`, `docs/design/design-system.md` and the PDF exports of the screens |
| Evidence | `docs/qa/validation-matrix.md`, `docs/adr/` and `docs/assumptions.md` |

## Rebuild the images

The diagrams, the screens and the brand are generated from the documents repository, cloned next to this one. The script needs `pdftoppm`, from poppler.

```bash
npm run assets                 # reads ../aromapacifico-devops-docs
npm run assets -- <path>       # reads another clone
```

The logo and the isotype are cut from `docs/design/aroma-pacifico-branding.pdf`. Replace them with the vector export of the design file when it is available.

## Identity

Colors, type and components follow the visual identity of the platform. Roast red `#8C0303` is the brand and never a button, Pacific blue `#0378A6` is the action color, Andean sun `#F29F05` is a graphic accent and never text, and the canvas is the warm `#FBF9F5`.

This is an academic case study of Universidad Icesi, 2026. Its figures, pilot and 2020 design are class material and do not describe an official project of the Federación Nacional de Cafeteros.
