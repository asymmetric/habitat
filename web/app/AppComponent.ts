// Copyright:: Copyright (c) 2016 Chef Software, Inc.
//
// The terms of the Evaluation Agreement (Bldr) between Chef Software Inc. and the party accessing
// this file ("Licensee") apply to Licensee's use of the Software until such time that the Software
// is made available under an open source license such as the Apache 2.0 License.

import {AppStore} from "./AppStore";
import {Component} from "angular2/core";
import {ExplorePageComponent} from "./explore-page/ExplorePageComponent";
import {HeaderComponent} from "./header/HeaderComponent";
import {HomePageComponent} from "./home-page/HomePageComponent";
import {NotificationsComponent} from "./notifications/NotificationsComponent";
import {PackagePageComponent} from "./package-page/PackagePageComponent";
import {PackagesPageComponent} from "./packages-page/PackagesPageComponent";
import {ProjectCreatePageComponent} from "./project-create-page/ProjectCreatePageComponent";
import {ProjectsPageComponent} from "./projects-page/ProjectsPageComponent";
import {RouteConfig, Router, RouterOutlet} from "angular2/router";
import {SideNavComponent} from "./side-nav/SideNavComponent";
import {SignInPageComponent} from "./sign-in-page/SignInPageComponent";
import {removeNotification, routeChange} from "./actions/index";

@Component({
    directives: [HeaderComponent, NotificationsComponent, RouterOutlet, SideNavComponent],
    selector: "bldr",
    template: `
    <div class="bldr-container">
        <bldr-notifications [notifications]="state.notifications" [removeNotification]="removeNotification">
        </bldr-notifications>
        <bldr-header [appName]="state.appName" [route]="state.route">
        </bldr-header>
        <bldr-side-nav></bldr-side-nav>
        <section class="bldr-main">
            <router-outlet></router-outlet>
        </section>
        <footer class="bldr-footer">
            <p>&copy; {{state.currentYear}} Chef Software, Inc. All Rights Reserved.</p>
        </footer>
    </div>`,
})

@RouteConfig([
    { path: "/", name: "Home", component: HomePageComponent },
    { path: "/explore", name: "Explore", component: ExplorePageComponent },
    { path: "/pkgs", name: "Packages", component: PackagesPageComponent },
    { path: "/pkgs/*/:name", name: "PackagesForName", component: PackagesPageComponent },
    {
        path: "/pkgs/:derivation", name: "PackagesForDerivation",
        component: PackagesPageComponent
    },
    {
        path: "/pkgs/:derivation/:name/:version/:release", name: "Package",
        component: PackagePageComponent
    },
    { path: "/projects", name: "Projects", component: ProjectsPageComponent },
    { path: "/projects/create", name: "ProjectCreate", component: ProjectCreatePageComponent },
    { path: "/sign-in", name: "SignIn", component: SignInPageComponent },
])

export class AppComponent {
    removeNotification: Function;

    constructor(private router: Router, private store: AppStore) {
        // Whenever the Angular route has an event, dispatch an event with the new
        // route data.
        router.subscribe(value => store.dispatch(routeChange(value)));

        // Listen for changes on the state.
        store.subscribe(state => {
            // If the state has a requestedRoute attribute, use the router to navigate
            // to the route that was requested.
            const requestedRoute = state.requestedRoute;
            if (requestedRoute) { router.navigate(requestedRoute); }
        });

        this.removeNotification = function (i) {
            this.store.dispatch(removeNotification(i));
            return false;
        }.bind(this);
    }

    get state() { return this.store.getState(); }
}