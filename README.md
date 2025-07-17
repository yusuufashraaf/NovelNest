# NovelNest

NovelNest is a web application built using Angular. It was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Features

- **Development Server**: Easily start a local development server for testing and debugging.
- **Code Scaffolding**: Generate components, directives, pipes, and more using Angular CLI schematics.
- **Build Optimization**: Create production-ready builds optimized for performance and speed.
- **Unit Testing**: Execute unit tests using the [Karma](https://karma-runner.github.io) test runner.
- **End-to-End Testing**: Run e2e tests with your preferred testing framework.

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Folder Structure

The project folder is organized as follows:

```
.editorconfig
.gitignore
angular.json
eslint.config.js
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.spec.json
.vscode/
    extensions.json
    launch.json
    tasks.json
public/
    favicon.ico
src/
    environment.prod.ts
    environment.ts
    index.html
    main.ts
    polyfills.server.ts
    polyfills.ts
    server.ts
    stopword.d.ts
    styles.css
    app/
        app.config.ts
        app.css
        app.html
        app.routes.server.ts
        app.routes.ts
        app.spec.ts
        app.ts
        components/
        directives/
        Guards/
        ...
    assets/
        ...
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
