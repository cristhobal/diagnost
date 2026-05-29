<div align="center">

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

---

**diagnost** [Astro](https://astro.build) प्रोजेक्ट्स के लिए एक डायग्नोस्टिक और लिंटिंग टूलकिट है। यह आपके प्रोजेक्ट को स्कैन करता है, 11 श्रेणियों में 20+ लिंट नियम चलाता है, एक स्वास्थ्य स्कोर की गणना करता है, और SEO, एक्सेसिबिलिटी, परफॉर्मेंस, सुरक्षा और अधिक में सर्वोत्तम प्रथाओं को बनाए रखने में मदद करता है।

## पैकेज

| पैकेज | प्रकाशित | विवरण |
|---|---|---|
| `diagnost-core` | [npm](https://www.npmjs.com/package/diagnost-core) | डायग्नोस्टिक इंजन: प्रोजेक्ट डिस्कवरी, लिंट नियम, फ़िल्टर पाइपलाइन और स्कोर गणना |
| `diagnost` | [npm](https://www.npmjs.com/package/diagnost) | CLI, टर्मिनल से Astro प्रोजेक्ट स्कैन करने के लिए |
| `eslint-plugin-diagnost` | [npm](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint प्लगइन, नियमों को ESLint नियमों के रूप में एक्सपोज़ करता है |

## विशेषताएँ

- **20+ लिंट नियम** 11 श्रेणियों में: SEO, एक्सेसिबिलिटी, परफॉर्मेंस, सुरक्षा, कंटेंट कलेक्शन, व्यू ट्रांज़िशन, रूटिंग, इमेजेज़, आइलैंड्स, i18n और कॉन्फ़िगरेशन
- **स्वास्थ्य स्कोर** (0–100), स्थानीय गणना या फ़ॉलबैक के साथ रिमोट API
- **सतह-आधारित फ़िल्टरिंग** — CLI, PR टिप्पणियों, CI आदि के लिए अलग-अलग नियम कॉन्फ़िगरेशन
- **Git एकीकरण** — केवल स्टेज की गई फ़ाइलें (pre-commit) या बेस ब्रांच से अंतर (CI) स्कैन करें
- **कॉन्फ़िगरेबल** — `.diagnost.json` कॉन्फ़िग फ़ाइल के साथ नियम/श्रेणी ओवरराइड और इग्नोर पैटर्न
- **एकाधिक आउटपुट फ़ॉर्मेट** — रंगीन CLI, JSON और कॉम्पैक्ट JSON
- **ESLint प्लगइन** — IDE एकीकरण के लिए नियम मेटाडेटा और कॉन्फ़िग प्रीसेट
- **समवर्ती स्ट्रीमिंग** — Effect Stream के माध्यम से समानांतर फ़ाइल लिंटिंग
- **फ़ेल-ऑन मोड** — गंभीरता सीमा पार होने पर exit code 1 (CI के लिए उपयुक्त)

## इंस्टॉलेशन

```bash
# ग्लोबल CLI
npm install -g diagnost

# या npx का उपयोग करके
npx diagnost .

# प्रोजेक्ट डिपेंडेंसी के रूप में
npm install --save-dev diagnost-core
```

### आवश्यकताएँ

- Node.js >= 18
- pnpm >= 9.1 (डेवलपमेंट के लिए)

## उपयोग

### CLI

```bash
# वर्तमान निर्देशिका स्कैन करें
diagnost

# किसी विशिष्ट निर्देशिका को स्कैन करें
diagnost ./path/to/project

# JSON आउटपुट
diagnost . --json

# केवल main से बदली गई फ़ाइलें (CI)
diagnost . --diff main

# केवल स्टेज की गई फ़ाइलें (pre-commit)
diagnost . --staged

# एरर पर फ़ेल करें
diagnost . --fail-on error

# फ़िक्स सुझाव और डॉक्स लिंक दिखाएँ
diagnost . --verbose

# AI असिस्टेंट के लिए स्किल इंस्टॉल करें (Claude Code, OpenCode)
diagnost install
```

### लाइब्रेरी के रूप में

```typescript
import { runInspect } from "diagnost-core"
import * as Effect from "effect/Effect"

const result = await Effect.runPromise(
  runInspect({ rootDir: "/path/to/project" })
)

console.log(result.diagnostics)
console.log(`स्कोर: ${result.score}`)
```

### ESLint प्लगइन

अपने `.eslintrc` में:

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

## नियम

| श्रेणी | नियम |
|---|---|
| **a11y** | `missing-lang`, `invalid-aria` |
| **config** | `missing-config`, `outdated-integration` |
| **content-collections** | `missing-schema`, `invalid-reference` |
| **i18n** | `missing-i18n-config` |
| **images** | `missing-image-component`, `missing-alt` |
| **islands** | `heavy-client-load`, `unnecessary-client-directive` |
| **performance** | `missing-prefetch`, `large-client-component` |
| **routing** | `missing-get-static-paths`, `invalid-dynamic-route` |
| **security** | `dangerous-script` |
| **seo** | `missing-head`, `missing-title`, `missing-meta-description` |
| **view-transitions** | `missing-view-transition`, `missing-animation` |

## कॉन्फ़िगरेशन

अपने प्रोजेक्ट रूट में `.diagnost.json` फ़ाइल बनाएँ:

```json
{
  "rules": {
    "seo/missing-title": "error",
    "a11y/missing-lang": "off"
  },
  "categories": {
    "performance": "warn"
  },
  "ignore": ["node_modules", "dist"],
  "surfaces": {
    "cli": {
      "excludeTags": ["ci-only"]
    }
  }
}
```

## डेवलपमेंट

```bash
# डिपेंडेंसी इंस्टॉल करें
pnpm install

# सभी पैकेज बनाएँ
pnpm build

# टाइपचेक
pnpm typecheck

# टेस्ट चलाएँ
pnpm test

# बिल्ड साफ़ करें
pnpm clean
```

## लाइसेंस

[MIT](../LICENSE.hi.md) © Cristhobal Canales
