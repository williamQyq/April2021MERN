# Folder structure

```
├── config # umi configuration, including routing, construction and other configurations
├── mock # local mock data
├── public
│ └── favicon.png # Favicon
├── src
│ ├── assets # Local static resources
│ ├── components # Business common components
│ ├── e2e # Integration test case
│ ├── layouts # General layout
│ ├── models # Global dva model
│ ├── pages # Business page entry and common templates
│ ├── services # Background interface services
│ ├── utils # tool library
│ ├── locales # Internationalized resources
│ ├── global.less # global style
│ └── global.ts # Global JS
├── tests # test tools
├── README.md
└── package.json

```

# Pages code structure

```
src
├── components
└── pages
    ├── Welcome // No other routing components should be included under routing components. Based on this convention, routing components and non-routing components can be clearly distinguished
    | ├── components // You can do more in-depth organization for complex pages, but it is recommended not to exceed three levels
    | ├── Form.tsx
    | ├── index.tsx // code of page component
    | └── index.less // page style
    ├── Order // No other routing components should be included under routing components. Based on this agreement, routing components and non-routing components can be clearly distinguished
    | ├── index.tsx
    | └── index.less
    ├── user // A series of pages recommend using a single lowercase letter as the group directory
    | ├── components // public component collection under group
    | ├── Login // page under group Login
    | ├── Register // page under group Register
    | └── util.ts // There can be some shared methods here, do not recommend and restrict, do your own organization depending on the business scenario
    └── * // Other page component codes

```