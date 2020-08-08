import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import * as FeatherIcon from 'react-feather';

import { isUserAuthenticated, getLoggedInUser } from '../helpers/authUtils';

// auth
const Login = React.lazy(() => import('../pages/auth/Login'));
const Logout = React.lazy(() => import('../pages/auth/Logout'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgetPassword = React.lazy(() => import('../pages/auth/ForgetPassword'));
const Confirm = React.lazy(() => import('../pages/auth/Confirm'));
// dashboard
// const Dashboard = React.lazy(() => import('../pages/dashboard'));
// apps
const CalendarApp = React.lazy(() => import('../pages/apps/Calendar'));
// const EmailInbox = React.lazy(() => import('../pages/apps/Email/Inbox'));
// const EmailDetail = React.lazy(() => import('../pages/apps/Email/Detail'));
// const EmailCompose = React.lazy(() => import('../pages/apps/Email/Compose'));
// const ProjectList = React.lazy(() => import('../pages/apps/Project/List'));
// const ProjectDetail = React.lazy(() => import('../pages/apps/Project/Detail/'));
// const TaskList = React.lazy(() => import('../pages/apps/Tasks/List'));
// const TaskBoard = React.lazy(() => import('../pages/apps/Tasks/Board'));

// pages
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const Stock = React.lazy(() => import('../pages/dashboard/stock'));
const Search = React.lazy(() => import('../pages/dashboard/search'));
const Agewise = React.lazy(() => import('../pages/dashboard/agewise'));
const History = React.lazy(() => import('../pages/dashboard/history'));
// const Profile = React.lazy(() => import('../pages/other/Profile/'));
// const Activity = React.lazy(() => import('../pages/other/Activity'));
// const Invoice = React.lazy(() => import('../pages/other/Invoice'));
// const Pricing = React.lazy(() => import('../pages/other/Pricing'));
// const Error404 = React.lazy(() => import('../pages/other/Error404'));
// const Error500 = React.lazy(() => import('../pages/other/Error500'));

// ui
// const BSComponents = React.lazy(() => import('../pages/uikit/BSComponents/'));
// const FeatherIcons = React.lazy(() => import('../pages/uikit/Icons/Feather'));
// const UniconsIcons = React.lazy(() => import('../pages/uikit/Icons/Unicons'));
// const Widgets = React.lazy(() => import('../pages/uikit/Widgets/'));

// charts
// const Charts = React.lazy(() => import('../pages/charts/'));

// forms
// const BasicForms = React.lazy(() => import('../pages/forms/Basic'));
// const FormAdvanced = React.lazy(() => import('../pages/forms/Advanced'));
// const FormValidation = React.lazy(() => import('../pages/forms/Validation'));
// const FormWizard = React.lazy(() => import('../pages/forms/Wizard'));
// const FileUpload = React.lazy(() => import('../pages/forms/FileUpload'));
// const Editor = React.lazy(() => import('../pages/forms/Editor'));

// // tables
// const BasicTables = React.lazy(() => import('../pages/tables/Basic'));
// const AdvancedTables = React.lazy(() => import('../pages/tables/Advanced'));

const Models = React.lazy(() => import('../pages/models'));
const ModelsAll = React.lazy(() => import('../pages/models/all'));

const Warehouses = React.lazy(() => import('../pages/warehouses'));
const WarehousesAll = React.lazy(() => import('../pages/warehouses/all'));

const Transactions = React.lazy(() => import('../pages/transactions'));

const GoodsIn = React.lazy(() => import('../pages/transactions/goodsin'));
const GoodsOut = React.lazy(() => import('../pages/transactions/goodsout'));
const GoodsTransfer = React.lazy(() => import('../pages/transactions/goodstransfer'));
const GoodsReturn = React.lazy(() => import('../pages/transactions/goodsreturn'));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (!isUserAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            }

            const loggedInUser = getLoggedInUser();
            // check if route is restricted by role
            if (roles && roles.indexOf(loggedInUser.role) === -1) {
                // role not authorised so redirect to home page
                return <Redirect to={{ pathname: '/' }} />;
            }

            // authorised so return component
            return <Component {...props} />;
        }}
    />
);

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboard" />,
    route: PrivateRoute,
};

// dashboard
const dashboardRoute = {
    path: '/dashboard',
    name: 'Dashboard',
    header: 'Navigation',
    icon: FeatherIcon.Home,
    component: Dashboard,
    route: PrivateRoute
};

const dashboardSubRoutes = [
    {
        path: '/stock',
        name: 'Stock',
        exact: true,
        component: Stock,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
    {
        path: '/search',
        name: 'Search',
        exact: true,
        component: Search,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
    {
        path: '/agewise',
        name: 'Agewise',
        exact: true,
        component: Agewise,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
    {
        path: '/history',
        name: 'History',
        exact: true,
        component: History,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
];

// items
const modelsRoute = {
    path: '/models',
    name: 'Models',
    exact: true,
    icon: FeatherIcon.Settings,
    component: Models,
    route: PrivateRoute
}

const modelsSubRoute = [
    {
        path: '/models/all',
        name: 'All Models',
        exact: true,
        component: ModelsAll,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
];

// items
const warehousesRoute = {
    path: '/warehouses',
    name: 'Warehouses',
    exact: true,
    icon: FeatherIcon.Home,
    component: Warehouses,
    route: PrivateRoute
}

const warehousesSubRoute = [
    {
        path: '/warehouses/all',
        name: 'All Warehouses',
        exact: true,
        component: WarehousesAll,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
];

const transactionsRoute = {
    path: '/transactions',
    name: 'Transactions',
    exact: true,
    icon: FeatherIcon.Move,
    component: Transactions,
    route: PrivateRoute
}

const transactionsSubRoute = [
    {
        path: '/transactions/goods-in',
        name: 'Goods In',
        exact: true,
        component: GoodsIn,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
    {
        path: '/transactions/goods-out',
        name: 'Goods Out',
        exact: true,
        component: GoodsOut,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
    {
        path: '/transactions/goods-transfer',
        name: 'Goods Transfer',
        exact: true,
        component: GoodsTransfer,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
    {
        path: '/transactions/goods-return',
        name: 'Goods Return',
        exact: true,
        component: GoodsReturn,
        route: PrivateRoute,
        roles: ['Admin', 'Office Executive', 'Manager']
    },
];

// requests
// const requestsRoute = {
//     path: '/requests',
//     name: 'Requests',
//     icon: FeatherIcon.GitPullRequest,
//     component: Starter,
//     route: PrivateRoute
// }

// payments
// const paymentsRoute = {
//     path: '/payments',
//     name: 'Payments',
//     icon: FeatherIcon.DollarSign,
//     component: Starter,
//     route: PrivateRoute
// }

// loan-calculator
// const loanCalculatorRoute = {
//     path: '/loan-calculator',
//     name: 'Loan Calculator',
//     icon: FeatherIcon.Percent,
//     component: Starter,
//     route: PrivateRoute
// }

// dashboards
// const dashboardRoutes = {
//     path: '/dashboard',
//     name: 'Dashboard',
//     icon: FeatherIcon.Home,
//     header: 'Navigation',
//     badge: {
//         variant: 'success',
//         text: '1',
//     },
//     component: Dashboard,
//     roles: ['Admin'],
//     route: PrivateRoute
// };

// apps

// const calendarAppRoutes = {
//     path: '/apps/calendar',
//     name: 'Calendar',
//     header: 'Apps',
//     icon: FeatherIcon.Calendar,
//     component: CalendarApp,
//     route: PrivateRoute,
//     roles: ['Admin'],
// };

// const emailAppRoutes = {
//     path: '/apps/email',
//     name: 'Email',
//     icon: FeatherIcon.Inbox,
//     children: [
//         {
//             path: '/apps/email/inbox',
//             name: 'Inbox',
//             component: EmailInbox,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/email/details',
//             name: 'Details',
//             component: EmailDetail,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/email/compose',
//             name: 'Compose',
//             component: EmailCompose,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ]
// };

// const projectAppRoutes = {
//     path: '/apps/projects',
//     name: 'Projects',
//     icon: FeatherIcon.Briefcase,
//     children: [
//         {
//             path: '/apps/projects/list',
//             name: 'List',
//             component: ProjectList,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/projects/detail',
//             name: 'Detail',
//             component: ProjectDetail,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ]
// };

// const taskAppRoutes = {
//     path: '/apps/tasks',
//     name: 'Tasks',
//     icon: FeatherIcon.Bookmark,
//     children: [
//         {
//             path: '/apps/tasks/list',
//             name: 'List',
//             component: TaskList,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/apps/tasks/board',
//             name: 'Board',
//             component: TaskBoard,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//     ],
// };

// const appRoutes = [calendarAppRoutes, emailAppRoutes, projectAppRoutes, taskAppRoutes];



// pages
// const pagesRoutes = {
//     path: '/pages',
//     name: 'Pages',
//     header: 'Custom',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/pages/starter',
//             name: 'Starter',
//             component: Starter,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/profile',
//             name: 'Profile',
//             component: Profile,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/activity',
//             name: 'Activity',
//             component: Activity,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/invoice',
//             name: 'Invoice',
//             component: Invoice,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/pricing',
//             name: 'Pricing',
//             component: Pricing,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/error-404',
//             name: 'Error 404',
//             component: Error404,
//             route: Route
//         },
//         {
//             path: '/pages/error-500',
//             name: 'Error 500',
//             component: Error500,
//             route: Route
//         },
//     ]
// };


// // components
// const componentsRoutes = {
//     path: '/ui',
//     name: 'UI Elements',
//     header: 'Components',
//     icon: FeatherIcon.Package,
//     children: [
//         {
//             path: '/ui/bscomponents',
//             name: 'Bootstrap UI',
//             component: BSComponents,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/ui/icons',
//             name: 'Icons',
//             children: [
//                 {
//                     path: '/ui/icons/feather',
//                     name: 'Feather Icons',
//                     component: FeatherIcons,
//                     route: PrivateRoute,
//                     roles: ['Admin'],
//                 },
//                 {
//                     path: '/ui/icons/unicons',
//                     name: 'Unicons Icons',
//                     component: UniconsIcons,
//                     route: PrivateRoute,
//                     roles: ['Admin'],
//                 },
//             ]
//         },
//         {
//             path: '/ui/widgets',
//             name: 'Widgets',
//             component: Widgets,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },

//     ]
// };

// // charts
// const chartRoutes = {
//     path: '/charts',
//     name: 'Charts',
//     component: Charts,
//     icon: FeatherIcon.PieChart,
//     roles: ['Admin'],
//     route: PrivateRoute
// }


// // forms
// const formsRoutes = {
//     path: '/forms',
//     name: 'Forms',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/forms/basic',
//             name: 'Basic Elements',
//             component: BasicForms,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/advanced',
//             name: 'Advanced',
//             component: FormAdvanced,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/validation',
//             name: 'Validation',
//             component: FormValidation,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/wizard',
//             name: 'Wizard',
//             component: FormWizard,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/editor',
//             name: 'Editor',
//             component: Editor,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/upload',
//             name: 'File Upload',
//             component: FileUpload,
//             route: PrivateRoute,
//         }
//     ]
// };


// const tableRoutes = {
//     path: '/tables',
//     name: 'Tables',
//     icon: FeatherIcon.Grid,
//     children: [
//         {
//             path: '/tables/basic',
//             name: 'Basic',
//             component: BasicTables,
//             route: PrivateRoute,
//         },
//         {
//             path: '/tables/advanced',
//             name: 'Advanced',
//             component: AdvancedTables,
//             route: PrivateRoute,
//         }]
// };


// auth
const authRoutes = {
    path: '/account',
    name: 'Auth',
    children: [
        {
            path: '/account/login',
            name: 'Login',
            component: Login,
            route: Route,
        },
        {
            path: '/account/logout',
            name: 'Logout',
            component: Logout,
            route: Route,
        },
        {
            path: '/account/register',
            name: 'Register',
            component: Register,
            route: Route,
        },
        {
            path: '/account/confirm',
            name: 'Confirm',
            component: Confirm,
            route: Route,
        },
        {
            path: '/account/forget-password',
            name: 'Forget Password',
            component: ForgetPassword,
            route: Route,
        },
    ],
};

// flatten the list of all nested routes
const flattenRoutes = routes => {
    let flatRoutes = [];

    routes = routes || [];
    routes.forEach(item => {
        flatRoutes.push(item);

        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes
const allRoutes = [
    rootRoute,
    dashboardRoute,
    ...dashboardSubRoutes,
    modelsRoute,
    ...modelsSubRoute,
    warehousesRoute,
    ...warehousesSubRoute,
    transactionsRoute,
    ...transactionsSubRoute,
    // requestsRoute,
    // paymentsRoute,
    // loanCalculatorRoute,
    // dashboardRoutes,
    // ...appRoutes,
    // pagesRoutes,
    // componentsRoutes,
    // chartRoutes,
    // formsRoutes,
    // tableRoutes,
    authRoutes,
];

// const authProtectedRoutes = [dashboardRoute, itemsRoute, requestsRoute, paymentsRoute, loanCalculatorRoute, ...appRoutes, pagesRoutes, componentsRoutes, chartRoutes, formsRoutes, tableRoutes];
// const allFlattenRoutes = flattenRoutes(allRoutes);
// export { allRoutes, authProtectedRoutes, allFlattenRoutes };

const authProtectedRoutes = [dashboardRoute, modelsRoute, warehousesRoute, transactionsRoute];
const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
