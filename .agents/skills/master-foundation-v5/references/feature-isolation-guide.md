# عزل الميزات البرمجية (Feature Isolation Guide)

---

## القاعدة الأساسية

كل ميزة ذات منطق أو واجهة مستقلة تعيش في مجلد شريحة معزولة (`src/features/<feature-name>/`) أو ما يكافئها في لغة المشروع.

---

## هيكل الميزة

### ميزة متكاملة (Full Feature):
```
src/features/<feature-name>/
├── index.ts              # Public API — المنفذ العام الوحيد للميزة
├── components/           # مكونات الواجهة الخاصة بالميزة
├── hooks/                # الخطافات المخصصة (Custom Hooks)
├── services/             # منطق الأعمال وربط البيانات
├── types.ts              # الأنواع ونماذج البيانات (Types/Schemas)
├── utils.ts              # دوال مساعدة خاصة بالميزة
└── __tests__/            # اختبارات الميزة
```

### ميزة صغيرة أو خفيفة (Minimal Feature):
```
src/features/<feature-name>/
├── index.ts              # المنفذ العام + الكود (ملف واحد يفي بالغرض)
└── __tests__/            # اختبارات التحقق
```

> 💡 **ملاحظة:** ابدأ بالهيكل الأدنى وتجنب إنشاء مجلدات فارغة حتى تدعو الحاجة إليها.

---

## قواعد الاستيراد والحدود (Import Boundaries)

### ✅ مسموح:
```typescript
// استيراد من المنفذ العام (Public API) للميزة فقط
import { NotificationBadge } from '@/features/notifications';
import { useAuth } from '@/features/auth';

// استيراد الأدوات المشتركة العامة في النظام
import { Button } from '@/components/ui';
import { formatDate } from '@/utils';
```

### ❌ محظور:
```typescript
// ❌ استيراد عميق من داخل الملفات الداخلية لميزة أخرى
import { internalHelper } from '@/features/notifications/utils/helpers';

// ❌ استيراد المكون الداخلي متجاوزاً ملف index.ts
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
```

### القاعدة الذهبية:
> **إذا احتاجت ميزة ما وظيفة معينة من ميزة أخرى، يجب تصديرها صراحة من ملف `index.ts` للميزة، أو نقل تلك الوظيفة إلى مجلد المشتركات العام (`shared/`).**

---

## تنبيهات معمارية

### تحسين حزم الاستيراد (Tree-Shaking):
لتجنب تضخم حجم الحزم عند استخدام ملفات الفهرس (`index.ts`):
- يفضل تصدير المكونات بشكل صريح ومحدد:  
  `export { UserProfile } from './components/UserProfile';`  
  بدلاً من التصدير الشامل الأعمى `export * from './components'`.

### الواقعية وعدم الإفراط (YAGNI):
- المكون الذي لا يُستخدم إلا في صفحة واحدة يبقى مع صفحته.
- الميزة التي لا تتعدى دالة واحدة أو تعديل سطرين لا تحتاج إلى شريحة مجلدات معقدة.
