Design a complete, production-ready mobile Telegram Mini App for a modern food ordering service.

IMPORTANT:

This is the CUSTOMER APP only.

Do NOT design the Admin Dashboard in this file.

Do NOT design backend screens.

Do NOT design database interfaces.

Do NOT design a generic food delivery website.

This must feel like a real premium food-ordering application running inside Telegram.

The final design will later be implemented in React and connected to a real Telegram Bot, PostgreSQL database, backend API, restaurant order Telegram group, and courier system.

The design must therefore be practical, consistent, responsive, and implementation-ready.

==================================================

1. PRODUCT
   ==================================================

The application allows customers to:

* Browse food
* Browse categories
* Search products
* View food details
* Select quantities
* Select extras/options
* Add food to cart
* View cart
* Enter delivery information
* Share location
* Place an order
* Receive an order number
* Track order status
* View previous orders
* Reorder previous purchases
* Manage their profile
* Save favorite products

The main ordering experience happens inside Telegram.

The customer should feel that the app is extremely fast and easy to use.

==================================================
2. DESIGN DIRECTION
===================

Create a modern, premium, friendly food brand.

Visual personality:

* Delicious
* Fresh
* Warm
* Fast
* Modern
* Trustworthy
* Simple
* Premium but not expensive-looking

Use a light interface.

Use a strong food-related primary brand color.

Use a neutral background.

Use dark readable text.

Use one consistent accent color for primary actions.

Do not use excessive gradients.

Do not use excessive glassmorphism.

Do not use random colors.

Do not make the UI look like a generic AI template.

The food photography should be one of the strongest visual elements.

==================================================
3. TELEGRAM MINI APP PRINCIPLES
===============================

Design specifically for Telegram Mini App usage.

The interface must:

* Be mobile-first
* Work well with one hand
* Have large touch targets
* Avoid unnecessary navigation
* Keep primary actions obvious
* Use compact but comfortable spacing
* Respect Telegram's environment
* Feel natural inside Telegram

Primary design width:

390px

Also make the design adaptable to:

375px
414px

Use Auto Layout throughout the design.

==================================================
4. FIGMA FILE STRUCTURE
=======================

Create these pages:

00 — Cover
01 — Design System
02 — Customer App
03 — Components
04 — Prototype
05 — Assets

Organize everything clearly.

Use descriptive frame names.

Example:

Customer App / Onboarding / 01
Customer App / Home
Customer App / Catalog
Customer App / Product
Customer App / Cart
etc.

==================================================
5. DESIGN SYSTEM
================

Before creating screens, create the design system.

Include:

COLOR TOKENS

* Primary
* Primary pressed
* Primary light
* Background
* Surface
* Surface secondary
* Text primary
* Text secondary
* Text disabled
* Border
* Success
* Warning
* Error
* Discount

TYPOGRAPHY

Create:

* Display
* Heading 1
* Heading 2
* Heading 3
* Body large
* Body
* Body small
* Caption
* Button
* Price large
* Price small

Use a modern highly readable font.

SPACING

Use an 8px-based spacing system.

Define:

4
8
12
16
20
24
32
40
48

RADIUS

Create consistent radius tokens.

Use:

Small
Medium
Large
Extra Large
Full / Pill

SHADOWS

Create subtle elevation levels.

Avoid heavy shadows.

==================================================
6. COMPONENT SYSTEM
===================

Create reusable components before designing the screens.

Components should include:

* Primary Button
* Secondary Button
* Text Button
* Icon Button
* Add Button
* Quantity Selector
* Product Card
* Product Horizontal Card
* Category Chip
* Selected Category Chip
* Story Bubble
* Discount Badge
* Price Component
* Cart Item
* Order Card
* Status Badge
* Search Bar
* Header
* Bottom Navigation
* Bottom Sheet
* Modal
* Toggle
* Checkbox
* Radio
* Input
* Location Button
* Toast
* Skeleton Loader
* Empty State
* Error State
* Loading Indicator

Create component variants.

Buttons:

Default
Pressed
Disabled
Loading

Inputs:

Default
Focused
Filled
Error
Disabled

==================================================
7. ONBOARDING
=============

Create 3 onboarding screens.

Design them as a cohesive sequence.

---

## ONBOARDING 01

Headline:

"Sizni ochlik qiynayaptimi?"

Supporting text:

"Issiqqina va mazali taomlarni tezkor buyurtma qiling."

Large attractive food visual.

Include:

* Progress indicator
* Skip
* Continue

---

## ONBOARDING 02

Headline:

"Bu qanday ishlaydi?"

Supporting text:

"Taomni tanlang, buyurtma bering va rohatlaning."

Show a simple 3-step visual:

1. Tanlang
2. Buyurtma bering
3. Rohatlaning

---

## ONBOARDING 03

Headline:

"Buyurtma berishga tayyormisiz?"

Supporting text:

"Sevimli taomlaringiz bir necha bosqichda eshigingizgacha."

Include social proof.

Primary CTA:

"Boshla"

The onboarding must feel short and exciting.

==================================================
8. HOME
=======

Create the main home screen.

Top:

Avatar
Customer name
Greeting
Notification icon

Example:

"Salom, Saidislom 👋"

"Bugun nima tanlaysiz?"

Do not make the header too large.

---

## STORIES

Create horizontal Instagram-style story bubbles.

Examples:

Bugungi aksiya
Yangi
Combo
Chegirma

Each story should have:

* Circular image
* Label

---

## PROMOTION HERO

Create a strong promotional banner.

Example:

"Bugungi maxsus taklif"

"20% gacha chegirma"

CTA:

"Ko'rish"

Use beautiful food imagery.

---

## CATEGORIES

Horizontal scrolling category chips.

Examples:

Hammasi
Pizza
Burger
Lavash
Ichimliklar
Desert

Make the selected category visually obvious.

---

## POPULAR PRODUCTS

Create a product section.

Title:

"Ko'p buyurtma qilinadiganlar"

CTA:

"Barchasini ko'rish"

Product cards should show:

* Large image
* Name
* Short description
* Current price
* Old price
* Discount badge
* Add button

==================================================
9. BOTTOM NAVIGATION
====================

Create persistent bottom navigation.

Items:

🏠
Bosh sahifa

🔍
Katalog

🛒
Savatcha

👤
Profil

Cart should show an item count badge.

The active tab must be obvious.

Do not make the navigation too tall.

==================================================
10. CATALOG
===========

Create a complete catalog screen.

Header:

"Katalog"

Search button/search field.

Below:

Horizontal category navigation.

Then:

Product grid.

Product card:

Image
Name
Description
Current price
Old price
Discount
Add button

Make the cards visually appetizing.

==================================================
11. SEARCH
==========

Create search state.

Search field at the top.

Before searching:

"Yaqinda qidirilganlar"

"Popular"

After searching:

Results.

No-results state:

"Hech narsa topilmadi"

"Qidiruv so'rovini o'zgartirib ko'ring."

Also create:

* Loading search
* Empty search
* Search with results

==================================================
12. PRODUCT DETAILS
===================

When a customer taps a product, show a bottom sheet.

The bottom sheet should feel premium.

Top:

Large product image.

Then:

Product name
Description
Price
Old price
Discount

Ingredients:

"Tarkibi"

Example:

• Mozzarella
• Pomidor sousi
• Pepperoni
• Zaytun

Then optional extras.

Example:

Qo'shimcha pishloq +5 000 so'm

Coca-Cola +5 000 so'm

Quantity selector.

At the bottom use a sticky CTA:

"Savatchaga qo'shish — 45 000 so'm"

The price should dynamically reflect quantity/options.

Create:

* Default
* With extras
* Quantity increased
* Out of stock

==================================================
13. CART
========

Create a beautiful cart.

Title:

"Savatcha"

Each item:

Image
Name
Options
Quantity
Price
Remove

Quantity controls:

− 1 +

Then upsell:

"Bunga qo'shimcha ravishda Coca-Cola ni atigi 5 000 so'mga qo'shasizmi?"

Use a clean toggle/add interaction.

Order summary:

Mahsulotlar
Delivery
Discount
Jami

Make total visually dominant.

Primary CTA:

"Buyurtmani tasdiqlash"

==================================================
14. EMPTY CART
==============

Create a dedicated empty state.

Illustration/food visual.

Headline:

"Savatchangiz hozircha bo'sh"

Supporting text:

"Sevimli taomlaringizni tanlashni boshlang."

CTA:

"Katalogni ko'rish"

==================================================
15. CHECKOUT
============

Create a simple checkout screen.

Title:

"Buyurtmani rasmiylashtirish"

Customer information:

Name
Phone number

Delivery:

Manzil
Location

Create a prominent:

"📍 Joylashuvni yuborish"

interaction.

If Telegram information is available, design the fields as prefilled.

Add:

"Yetkazib berish uchun izoh"

Order summary.

Show:

Subtotal
Delivery
Discount
Total

Primary CTA:

"Buyurtma berish"

Do not make checkout feel like a long registration form.

==================================================
16. LOCATION
============

Create location interaction.

States:

1. Location not provided
2. Request location
3. Location selected
4. Location confirmed
5. Location error

Show a map/location visual where appropriate.

Make the location confirmation extremely clear.

==================================================
17. ORDER SUCCESS
=================

Create a strong success screen.

Large success illustration.

Headline:

"Buyurtmangiz qabul qilindi! 🎉"

Supporting:

"Kuryerimiz tez orada siz bilan bog'lanadi."

Show:

Buyurtma raqami

Example:

#A7K29

Estimated delivery:

"30–45 daqiqa"

Total:

95 000 so'm

Buttons:

"Buyurtmani kuzatish"

"Uyga qaytish"

==================================================
18. ORDER TRACKING
==================

Create a real order tracking screen.

Show order number prominently.

Example:

#A7K29

Timeline:

✓ Buyurtma qabul qilindi

✓ Tayyorlanmoqda

● Kuryerga berildi

○ Yetkazilmoqda

○ Yetkazildi

Show:

* Estimated time
* Items
* Total
* Delivery address
* Courier information when assigned

When courier is assigned, show:

"🚚 Kuryeringiz: Aziz"

Optionally show:

"Qo'ng'iroq qilish"

The interface must remain simple.

==================================================
19. ORDER HISTORY
=================

Create:

"Mening buyurtmalarim"

Each order card:

Order number
Date
Items
Total
Status

Statuses:

Yetkazildi
Jarayonda
Bekor qilindi

Primary action:

"Yana buyurtma qilish"

==================================================
20. ORDER DETAILS
=================

Create detailed order view.

Show:

Order number
Date
Products
Quantities
Prices
Subtotal
Delivery
Discount
Total
Address
Status timeline

CTA:

"Qayta buyurtma qilish"

==================================================
21. PROFILE
===========

Create profile screen.

Top:

Avatar
Name
Phone

Sections:

📜 Mening buyurtmalarim
❤️ Sevimlilar
📍 Manzillar
🔔 Bildirishnomalar
⚙️ Sozlamalar
❓ Yordam

Keep the screen minimal.

==================================================
22. FAVORITES
=============

Create favorites page.

Product cards.

Allow:

Remove favorite
Add to cart

Create empty state:

"Hali sevimlilar yo'q"

CTA:

"Taomlarni ko'rish"

==================================================
23. DELIVERY ADDRESSES
======================

Create saved address interface.

Show:

Home
Work
Other

Each address can be:

* Selected
* Edited
* Deleted

Create:

"+ Yangi manzil"

Also create an empty state.

==================================================
24. NOTIFICATIONS
=================

Create notification screen.

Examples:

"✅ #A7K29 buyurtmangiz qabul qilindi."

"👨‍🍳 #A7K29 tayyorlanmoqda."

"🚚 #A7K29 kuryerga berildi."

"🎉 #A7K29 yetkazildi."

Use clear timestamps.

==================================================
25. HELP
========

Create a simple support page.

Options:

☎️ Operator bilan bog'lanish
📦 Buyurtma bo'yicha yordam
❓ Ko'p so'raladigan savollar

Keep it very simple.

==================================================
26. ERROR STATES
================

Create realistic error screens/states.

Examples:

Internet connection lost

"Internet aloqasi mavjud emas."

CTA:

"Qayta urinish"

Server error

"Xatolik yuz berdi."

CTA:

"Qayta urinish"

Product unavailable

"Bu mahsulot hozircha mavjud emas."

Order failure

"Buyurtmani yuborib bo'lmadi."

CTA:

"Qayta urinish"

==================================================
27. LOADING STATES
==================

Create skeleton loaders for:

Home
Catalog
Product
Cart
Order history
Order tracking

Do not use only generic spinners.

Skeletons should match the actual layout.

==================================================
28. TOASTS
==========

Create notification examples:

"✓ Pizza savatchaga qo'shildi"

"✓ Buyurtma qabul qilindi"

"✓ Sevimlilarga qo'shildi"

"✓ Sevimlilardan olib tashlandi"

==================================================
29. IMPORTANT ORDER UX
======================

The customer must ALWAYS know:

* What they ordered
* How much it costs
* Their order number
* Current order status
* Where the order is going

Do not hide these details.

The order number must be visually prominent.

Example:

#A7K29

This number will also be used internally by restaurant staff and couriers.

==================================================
30. COURIER-READY DESIGN
========================

The customer app must be prepared for a future courier system.

When a courier is assigned, customer order tracking can display:

🚚 Aziz is on the way

The backend will later support:

Courier assignment
Courier status
Delivery status

Do NOT build the courier application in this Figma file.

Only prepare the customer UI needed for courier-related information.

==================================================
31. RESPONSIVE DESIGN
=====================

Primary frame:

390 × appropriate mobile height

Also account for:

375px
414px

Do not rely on fixed positioning that breaks on different devices.

Use Auto Layout.

Use responsive constraints.

Keep important CTAs within easy thumb reach.

==================================================
32. ACCESSIBILITY
=================

Ensure:

* Good contrast
* Large readable text
* Minimum approximately 44px touch targets
* Clear active states
* Clear error states
* Status should not rely only on color
* Buttons must be recognizable
* Icons should have text where necessary

==================================================
33. MOTION
==========

Prototype realistic interactions.

Use subtle animation.

Important interactions:

Product card
→ Product bottom sheet

Add to cart
→ Cart badge updates

Cart
→ Checkout

Checkout
→ Order success

Order success
→ Tracking

Bottom navigation
→ Page transitions

Do not over-animate.

The product should feel fast.

==================================================
34. PROTOTYPE FLOW
==================

Connect the complete primary prototype:

Splash
↓
Onboarding
↓
Home
↓
Catalog
↓
Product
↓
Add to Cart
↓
Cart
↓
Checkout
↓
Location
↓
Confirm Order
↓
Order Success
↓
Order Tracking

Also connect:

Home
→ Profile
→ Orders
→ Order Details
→ Reorder

Home
→ Favorites

Home
→ Search

==================================================
35. FINAL DESIGN AUDIT
======================

Before finishing, inspect every screen.

Check:

* Consistent spacing
* Consistent typography
* Consistent colors
* Consistent buttons
* Consistent cards
* Consistent icon style
* Correct bottom navigation
* Correct pricing hierarchy
* Correct discount presentation
* Clear order number
* Clear CTA
* Clear order status
* Good empty states
* Good error states
* Good loading states
* Good mobile usability

Remove unnecessary elements.

Make every screen feel like the same product.

==================================================
36. FINAL FIGMA DELIVERABLE
===========================

The final file must contain:

DESIGN SYSTEM

✓ Colors
✓ Typography
✓ Spacing
✓ Radius
✓ Shadows
✓ Components
✓ Component variants

CUSTOMER MINI APP

✓ Splash
✓ 3 Onboarding screens
✓ Home
✓ Stories
✓ Promotions
✓ Categories
✓ Catalog
✓ Search
✓ Product details
✓ Cart
✓ Empty cart
✓ Checkout
✓ Location
✓ Order success
✓ Order tracking
✓ Profile
✓ Favorites
✓ Addresses
✓ Notifications
✓ Help
✓ Order history
✓ Order details
✓ Reorder
✓ Loading states
✓ Empty states
✓ Error states
✓ Toasts

PROTOTYPE

✓ Complete ordering flow
✓ Navigation
✓ Cart interactions
✓ Checkout
✓ Order tracking
✓ Profile
✓ Order history
✓ Reorder

IMPORTANT:

Do not stop after making a few attractive screens.

Create the COMPLETE CUSTOMER EXPERIENCE.

The final Figma file must be detailed enough that a React developer can implement the application without guessing the intended UI or user flow.

This Figma file will become the visual source of truth for the customer Telegram Mini App.
