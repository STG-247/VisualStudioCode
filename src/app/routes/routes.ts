export const routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'site', pathMatch: 'full' },
            { path: 'site', loadChildren: '../site/site.module#SiteModule' }
        ]
    },
    { path: '**', redirectTo: 'site'}
];
