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
"[project]/app/data/dummyData.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DATA",
    ()=>DATA
]);
const DATA = {
    bihar: {
        patna: [
            {
                name: "Blue Moon",
                slug: "bluemoon",
                pure_veg: false,
                categories: [
                    {
                        id: "c1",
                        name: "Starters",
                        products: [
                            {
                                id: "p1",
                                name: "Paneer Tikka",
                                veg: true,
                                available: true,
                                description: "Grilled paneer with spices",
                                sizes: [
                                    {
                                        id: "s1",
                                        size_label: "Half",
                                        price: 180
                                    },
                                    {
                                        id: "s2",
                                        size_label: "Full",
                                        price: 320
                                    }
                                ]
                            },
                            {
                                id: "p2",
                                name: "Chicken 65",
                                veg: false,
                                available: false,
                                description: "Deep fried spicy chicken",
                                sizes: [
                                    {
                                        id: "s3",
                                        size_label: "Full",
                                        price: 350
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "c2",
                        name: "Main Course",
                        products: [
                            {
                                id: "p3",
                                name: "Butter Chicken",
                                veg: false,
                                available: true,
                                sizes: [
                                    {
                                        id: "s4",
                                        size_label: "Half",
                                        price: 260
                                    },
                                    {
                                        id: "s5",
                                        size_label: "Full",
                                        price: 420
                                    }
                                ]
                            },
                            {
                                id: "p4",
                                name: "Shahi Paneer",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s6",
                                        size_label: "Half",
                                        price: 240
                                    },
                                    {
                                        id: "s7",
                                        size_label: "Full",
                                        price: 390
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "c3",
                        name: "Drinks",
                        products: [
                            {
                                id: "p5",
                                name: "Cold Coffee",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s8",
                                        size_label: "Regular",
                                        price: 120
                                    }
                                ]
                            },
                            {
                                id: "p6",
                                name: "Fresh Lime Soda",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s9",
                                        size_label: "Glass",
                                        price: 80
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "Green Leaf",
                slug: "greenleaf",
                pure_veg: true,
                categories: [
                    {
                        id: "c4",
                        name: "South Indian",
                        products: [
                            {
                                id: "p7",
                                name: "Masala Dosa",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s10",
                                        size_label: "Single",
                                        price: 110
                                    }
                                ]
                            },
                            {
                                id: "p8",
                                name: "Idli Sambhar",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s11",
                                        size_label: "2 Pieces",
                                        price: 60
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "c5",
                        name: "Chinese",
                        products: [
                            {
                                id: "p9",
                                name: "Veg Hakka Noodles",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s12",
                                        size_label: "Plate",
                                        price: 140
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        gaya: [
            {
                name: "Spice Hub",
                slug: "spicehub",
                pure_veg: false,
                categories: [
                    {
                        id: "c6",
                        name: "Starters",
                        products: [
                            {
                                id: "p10",
                                name: "Veg Manchurian",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s13",
                                        size_label: "Plate",
                                        price: 160
                                    }
                                ]
                            },
                            {
                                id: "p11",
                                name: "Chicken Pakoda",
                                veg: false,
                                available: true,
                                sizes: [
                                    {
                                        id: "s14",
                                        size_label: "Plate",
                                        price: 190
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    maharashtra: {
        pune: [
            {
                name: "Cafe Brew",
                slug: "cafebrew",
                pure_veg: false,
                categories: [
                    {
                        id: "c7",
                        name: "Coffee",
                        products: [
                            {
                                id: "p12",
                                name: "Cappuccino",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s15",
                                        size_label: "Small",
                                        price: 120
                                    },
                                    {
                                        id: "s16",
                                        size_label: "Large",
                                        price: 180
                                    }
                                ]
                            },
                            {
                                id: "p13",
                                name: "Cold Brew",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s17",
                                        size_label: "Glass",
                                        price: 160
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "c8",
                        name: "Snacks",
                        products: [
                            {
                                id: "p14",
                                name: "Chicken Sandwich",
                                veg: false,
                                available: true,
                                sizes: [
                                    {
                                        id: "s18",
                                        size_label: "Single",
                                        price: 150
                                    }
                                ]
                            },
                            {
                                id: "p15",
                                name: "Veg Grilled Sandwich",
                                veg: true,
                                available: true,
                                sizes: [
                                    {
                                        id: "s19",
                                        size_label: "Single",
                                        price: 120
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
}),
"[project]/app/[state]/[city]/[slug]/menu-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/[state]/[city]/[slug]/menu-client.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/[state]/[city]/[slug]/menu-client.tsx <module evaluation>", "default");
}),
"[project]/app/[state]/[city]/[slug]/menu-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/[state]/[city]/[slug]/menu-client.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/[state]/[city]/[slug]/menu-client.tsx", "default");
}),
"[project]/app/[state]/[city]/[slug]/menu-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$state$5d2f5b$city$5d2f5b$slug$5d2f$menu$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/[state]/[city]/[slug]/menu-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$state$5d2f5b$city$5d2f5b$slug$5d2f$menu$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/[state]/[city]/[slug]/menu-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$state$5d2f5b$city$5d2f5b$slug$5d2f$menu$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/[state]/[city]/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$dummyData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/data/dummyData.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$state$5d2f5b$city$5d2f5b$slug$5d2f$menu$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/[state]/[city]/[slug]/menu-client.tsx [app-rsc] (ecmascript)");
;
;
;
async function MenuPage({ params }) {
    const { state, city, slug } = await params;
    const restaurant = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$data$2f$dummyData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DATA"][state]?.[city]?.find((r)=>r.slug === slug);
    if (!restaurant) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4",
            children: "Menu not found"
        }, void 0, false, {
            fileName: "[project]/app/[state]/[city]/[slug]/page.tsx",
            lineNumber: 19,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f5b$state$5d2f5b$city$5d2f5b$slug$5d2f$menu$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        restaurant: restaurant
    }, void 0, false, {
        fileName: "[project]/app/[state]/[city]/[slug]/page.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/[state]/[city]/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[state]/[city]/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b17623c2._.js.map