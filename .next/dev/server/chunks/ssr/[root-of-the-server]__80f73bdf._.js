module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/lib/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProducts",
    ()=>getProducts,
    "getRestaurant",
    ()=>getRestaurant,
    "getRestaurants",
    ()=>getRestaurants
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://3.110.185.186:8000/api/v1");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
async function getRestaurants(params = "") {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 5000);
    try {
        const res = await fetch(`${("TURBOPACK compile-time value", "http://3.110.185.186:8000/api/v1")}/restaurants${params}`, {
            cache: "no-store",
            signal: controller.signal
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }
        return res.json();
    } finally{
        clearTimeout(timeout);
    }
}
async function getRestaurant(id) {
    const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        cache: "no-store"
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch restaurant: ${text}`);
    }
    return res.json();
}
async function getProducts(restaurantId) {
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/products`, {
        cache: "no-store"
    });
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    return res.json();
}
}),
"[project]/app/restaurants/[restaurantId]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RestaurantPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-rsc] (ecmascript)");
;
;
async function RestaurantPage({ params }) {
    // ✅ unwrap params
    const { restaurantId } = await params;
    const restaurant = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRestaurant"])(restaurantId);
    const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProducts"])(restaurantId);
    // Group products by category
    const categoryMap = {};
    products.forEach((product)=>{
        product.categories.forEach((cat)=>{
            if (!categoryMap[cat.name]) {
                categoryMap[cat.name] = [];
            }
            categoryMap[cat.name].push(product);
        });
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-4 pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: restaurant.name
                    }, void 0, false, {
                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    restaurant.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: restaurant.type
                    }, void 0, false, {
                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    restaurant.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500",
                        children: [
                            "📍 ",
                            restaurant.location
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    restaurant.pure_veg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-green-600 text-sm",
                        children: "🌱 Pure Veg"
                    }, void 0, false, {
                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: Object.entries(categoryMap).map(([category, items])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        open: true,
                        className: "border rounded-lg p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                className: "font-semibold cursor-pointer",
                                children: category
                            }, void 0, false, {
                                fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 space-y-3",
                                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-medium",
                                                        children: [
                                                            item.veg ? "🟢" : "🔴",
                                                            " ",
                                                            item.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                                        lineNumber: 59,
                                                        columnNumber: 21
                                                    }, this),
                                                    item.sizes?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        children: [
                                                            "₹",
                                                            item.sizes[0].price
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                                        lineNumber: 63,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                                lineNumber: 58,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "border px-3 py-1 rounded text-sm",
                                                children: "Add"
                                            }, void 0, false, {
                                                fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                                lineNumber: 67,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this)
                        ]
                    }, category, true, {
                        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/restaurants/[restaurantId]/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/restaurants/[restaurantId]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/restaurants/[restaurantId]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__80f73bdf._.js.map