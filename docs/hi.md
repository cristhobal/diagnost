<div align="center">

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-FAFAFA?style=for-the-badge&logo=astro&logoColor=080808&labelColor=FAFAFA">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-080808?style=for-the-badge&logo=astro&logoColor=FAFAFA&labelColor=080808">
</picture>

<br />
<br />

**[Astro](https://astro.build) प्रोजेक्ट्स के लिए एक डायग्नोस्टिक और लिंटिंग टूलकिट।**  
अपने कोडबेस को स्कैन करें, सर्वोत्तम प्रथाओं को लागू करें और अपने प्रोजेक्ट के स्वास्थ्य पर नज़र रखें — सब कुछ एक ही टूल में।

<br />

[![npm](https://img.shields.io/npm/v/diagnost?color=080808&labelColor=080808&label=diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost)
[![npm](https://img.shields.io/npm/v/diagnost-core?color=080808&labelColor=080808&label=diagnost-core&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core)
[![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?color=080808&labelColor=080808&label=eslint-plugin-diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost)
[![License: MIT](https://img.shields.io/badge/license-MIT-080808?style=flat-square&labelColor=080808&color=080808)](../LICENSES/hi.md)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-080808?style=flat-square&labelColor=080808&logo=node.js&logoColor=FAFAFA)](https://nodejs.org)

<br />

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

<br />

**🌐 [आधिकारिक वेबसाइट](https://usediagnost.vercel.app/) — दस्तावेज़, लाइव डेमो और विज़ुअल अवलोकन**

<br />

</div>

---

## अवलोकन

**diagnost** 11 श्रेणियों में 20+ लिंट नियम चलाता है, 0–100 का स्वास्थ्य स्कोर निकालता है, और SEO, एक्सेसिबिलिटी, परफ़ॉर्मेंस, सुरक्षा आदि में सर्वोत्तम प्रथाओं को बनाए रखने में मदद करता है — पूर्ण CI/CD और Git एकीकरण के साथ।

```
$ diagnost .

  diagnost  Astro Diagnostic Tool

  ✖  seo/missing-title          src/pages/about.astro
  ⚠  a11y/missing-lang          src/layouts/Base.astro
  ⚠  images/missing-alt         src/components/Hero.astro

  Health score: 74/100   3 issues found (1 error, 2 warnings)
```

---

## पैकेज

| पैकेज | संस्करण | विवरण |
|---|---|---|
| [`diagnost`](https://www.npmjs.com/package/diagnost) | [![npm](https://img.shields.io/npm/v/diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost) | CLI, टर्मिनल से Astro प्रोजेक्ट स्कैन करने के लिए |
| [`diagnost-core`](https://www.npmjs.com/package/diagnost-core) | [![npm](https://img.shields.io/npm/v/diagnost-core?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core) | डायग्नोस्टिक इंजन: प्रोजेक्ट डिस्कवरी, लिंट नियम, फ़िल्टर पाइपलाइन और स्कोर गणना |
| [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost) | [![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint प्लगइन, IDE एकीकरण हेतु नियमों को ESLint नियमों के रूप में एक्सपोज़ करता है |

---

## विशेषताएँ

- **20+ लिंट नियम** 11 श्रेणियों में: SEO, एक्सेसिबिलिटी, परफ़ॉर्मेंस, सुरक्षा, कंटेंट कलेक्शन, व्यू ट्रांज़िशन, रूटिंग, इमेजेज़, आइलैंड्स, i18n और कॉन्फ़िगरेशन
- **स्वास्थ्य स्कोर** (0–100), स्थानीय गणना या फ़ॉलबैक के साथ रिमोट API
- **सतह-आधारित फ़िल्टरिंग** — CLI, PR टिप्पणियों, CI आदि के लिए अलग-अलग नियम कॉन्फ़िगरेशन
- **Git एकीकरण** — केवल स्टेज की गई फ़ाइलें (pre-commit) या बेस ब्रांच से अंतर (CI) स्कैन करें
- **कॉन्फ़िगरेबल** — `.diagnost.json` कॉन्फ़िग फ़ाइल के साथ प्रति-नियम/प्रति-श्रेणी ओवरराइड और इग्नोर पैटर्न
- **एकाधिक आउटपुट फ़ॉर्मेट** — रंगीन CLI, JSON और कॉम्पैक्ट JSON
- **ESLint प्लगइन** — IDE एकीकरण के लिए नियम मेटाडेटा और कॉन्फ़िग प्रीसेट
- **समवर्ती स्ट्रीमिंग** — Effect Stream के माध्यम से समानांतर फ़ाइल लिंटिंग
- **फ़ेल-ऑन मोड** — गंभीरता सीमा पार होने पर एग्ज़िट कोड 1 (CI के लिए उपयुक्त)

---

## इंस्टॉलेशन

```bash
# ग्लोबल CLI
npm install -g diagnost

# या बिना इंस्टॉल किए चलाएँ
npx diagnost .

# प्रोजेक्ट डिपेंडेंसी के रूप में
npm install --save-dev diagnost-core
```

> **आवश्यकताएँ:** Node.js >= 18 · pnpm >= 9.1 (डेवलपमेंट के लिए)

---

## उपयोग

### CLI

```bash
# वर्तमान निर्देशिका स्कैन करें
diagnost

# किसी विशिष्ट पथ को स्कैन करें
diagnost ./path/to/project

# JSON आउटपुट
diagnost . --json

# केवल main से बदली गई फ़ाइलें (CI)
diagnost . --diff main

# केवल स्टेज की गई फ़ाइलें (pre-commit हुक)
diagnost . --staged

# एरर होने पर एग्ज़िट कोड 1 के साथ बाहर निकलें
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
console.log(`Score: ${result.score}`)
```

### ESLint प्लगइन

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

---

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

---

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

| फ़ील्ड | प्रकार | विवरण |
|---|---|---|
| `rules` | `Record<string, "error" \| "warn" \| "off">` | अलग-अलग नियमों की गंभीरता ओवरराइड करें |
| `categories` | `Record<string, "error" \| "warn" \| "off">` | किसी श्रेणी के सभी नियमों की गंभीरता ओवरराइड करें |
| `ignore` | `string[]` | स्कैनिंग से बाहर रखने हेतु glob पैटर्न |
| `surfaces` | `Record<string, SurfaceConfig>` | प्रति सतह (CLI, CI आदि) नियम-समूह कॉन्फ़िगर करें |

---

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

# बिल्ड आर्टिफ़ैक्ट साफ़ करें
pnpm clean
```

---

## आभार

**diagnost** [millionco](https://github.com/millionco) द्वारा बनाए गए [**react-doctor**](https://github.com/millionco/react-doctor) से प्रेरित और उस पर आधारित है — React प्रोजेक्ट्स के लिए समान दर्शन वाला एक डायग्नोस्टिक और लिंटिंग टूलकिट: कोडबेस स्कैन करें, सर्वोत्तम प्रथाएँ लागू करें और 0–100 का स्वास्थ्य स्कोर पाएँ।

- 🔗 GitHub: [millionco/react-doctor](https://github.com/millionco/react-doctor)
- 🌐 वेबसाइट: [react.doctor](https://www.react.doctor/)
- 📦 npm: [react-doctor](https://www.npmjs.com/package/react-doctor)

## लाइसेंस

[MIT](../LICENSES/hi.md) © Cristhobal Canales
