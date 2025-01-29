# MS Word JS Plugin

## Contributing

- Please start by looking at unassigned issues with and
  choose based on their priority. That is, please claim any open `🔥 high_priority` issue
  over `❗ normal_priority` over `❕low_priority`.

- Once you start working on the issue, **assign** yourself the issue so we do not
  duplicate coding.

- If the [Figma design](https://www.figma.com/file/hr1FGPqCUM4Vxaiiqf2YIT/Rooka?type=design&node-id=2%3A7&mode=design&t=PRJ7GGfvhxxuDzzV-1)
  is not clear, please ask us how the UX should behave.

- Try to keep PR atomic, and relatively small, it should focus on one thing at a time,
  we can then iterate quickly and make the reviews faster/better. Feel free to open a
  draft PR as soon as you have anything going on.

- Use `git rebase origin/main` to bring your PR up to date with main and address the
  conflicts during the rebase process.

- When you want re-review do not forget to click on the circle button next to the
  reviewers name.

- We are extremely open to any suggestions, including the UX, codebase ...

## Applies to

- Word on Windows
- Word on Mac
- Word on the web

## Prerequisites

- Office connected to a Microsoft 365 subscription (including Office on the web, which
  you can use for free).
- [Node.js](https://nodejs.org/) version 16 or greater.
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 8 or
  greater.

## Getting started

1. Clone repository
2. run `npm install`
3. Check if project builds properly `npm run build`
4. Copy `.env.example` to `.env`
5. Start a local server and sideload the addin

- Windows/Mac: `npm run start:desktop` (admin permissions might be required for first
  run)
- It's also possible to start the VSCode task 'Word Desktop (Edge Chromium) with
  debugger attached

### Run in browser version of MS Word

- `npm install`
- Copy `.env.example` to `.env`
- `npm run dev-server`
- In your browser allow for invalid SSL certificates from localhost:3000
  (for Firefox e.g. <https://stackoverflow.com/questions/20088/is-there-a-way-to-make-firefox-ignore-invalid-ssl-certificates>)
- In Word in the browser: Go to add-ins -> More add-ins -> My add-ins -> Upload manifest
- Singledraft should pop up in the menu bar

## Design, documentation, files to use for testing

- Please find, under tab 'UI - Work in Progress', the [design in Figma](https://www.figma.com/file/hr1FGPqCUM4Vxaiiqf2YIT/Rooka?type=design&node-id=2%3A7&mode=design&t=PRJ7GGfvhxxuDzzV-1)

- The explanation of functionality is available in the
  [documentation](https://docs.singledraft.ai/). If anything is unclear or not up to
  date there, please let us know so we can update it.

- Various files to test are available for download under
  [this Dropbox link](https://www.dropbox.com/scl/fo/jz36nazy5tmf98m2fpmu1/AIBem4ivWfzueuJR0Bo7OUc?rlkey=a9fmyvja2sv35aznkxd0pnhw8&dl=0)

## Backend Notes

The plugin needs to communicate with various backend services that we implement
and operate.

### Authentication

To be able to connect to backend APIs developer must be in our user DB (AWS Cognito).
We have 2 user pools, one for dev and for prod. The prod should be mainly used for
customers, if development of plugin requires contacting prod backend then also the
developer must be in prod user pool.

To create user in dev user pool, go to <https://dev.app.rooka.ai/> and register
(access to this app is handy for other tasks). For prod user pool, go to
<https://download.singledraft.ai/> and register.

To call most of the endpoints the user must log in by calling our authentication
service.

### Authentication API

Auth API has 2 environments, dev or prod. Based on which endpoints
plugin should communicate the particular auth API should be called.
It is deployed in AWS API Gateway, we don't have currently automatically generated
swagger.

DEV: <https://82rkl73jmi.execute-api.eu-central-1.amazonaws.com/v1dev>

PROD: <https://82rkl73jmi.execute-api.eu-central-1.amazonaws.com/v1prd>

Plugin needs these endpoints to communicate with:

- auth_api/login - for getting JWT
- auth_api/refresh_token - for refreshing the access tokens
- auth_api/reset_password/initialize - to reset password
- auth_api/intercom/user - get user Intercom data, is also now available at Webapp API
  (described later).
- auth_api/newrelic - get NewRelic credentials to sent events to monitoring, is also
  now available at Webapp API (described later).

There will be soon change where we will also need to support Microsoft SSO. With that
the email/password flow will also change.

We manually maintain the Swagger yaml for the auth API. Link to shared drive:
<https://drive.google.com/file/d/1d4BDteYug663V6HJMk-RdExACu5ViShN/view?usp=sharing>

### Cards API

DEV: <https://pairlegaldev.singledraft.ai/cardsapi/>

PROD: <https://pairlegalprd.singledraft.ai/cardsapi/>

Swagger: <https://pairlegaldev.singledraft.ai/cardsapi/v2/docs>

OpenAPI Spec: <https://pairlegaldev.singledraft.ai/cardsapi/v2/openapi.json>

Responsible for providing:

- v2/cards - Insights (cards)
- Compare feature (Legal Vocabulary look up) - will be added

If the API does not return 200 we always return in the error response
`ErrorMessageCodes` which should indicate to the client what should be done - if the
code is to be retried or not. And eventually `user_message` should be displayed
in both cases: when not retried or after failed retrying.

### Koldine API

DEV: <https://pairlegaldev.singledraft.ai/koldineapi/>

PROD: <https://pairlegalprd.singledraft.ai/koldineapi/>

Swagger: <https://pairlegaldev.singledraft.ai/koldineapi/v2/docs>

OpenAPI Spec: <https://pairlegaldev.singledraft.ai/koldineapi/v2/openapi.json>

Responsible for providing these REST endpoints:

- v2/prompts - Get all default user prompts that backend is providing
- v2/adaptive-replace - For adaptive replace functionality

Responsible for providing these websockets:

- v2/chat - websocket for chat interface - not part of Swagger (limitation of
  OpenAPI spec)
- v2/rewrite - websocket for rewrite interface - not part of Swagger (limitation of
  OpenAPI spec)

Websocket interface object models:
<https://drive.google.com/file/d/1r99tF7b2604koM4D_bY97ckgUwv5Mcs-/view?usp=sharing>

### Webapp API

DEV: <https://pairlegaldev.singledraft.ai/webapi/>

PROD: <https://pairlegalprd.singledraft.ai/webapi/>

Swagger: <https://pairlegaldev.singledraft.ai/webapi/v1/docs>

OpenAPI Spec: <https://pairlegaldev.singledraft.ai/webapi/v1/openapi.json>

For plugin these endpoints are of interest:

- v1/mngmt/intercom/user - the same as `auth_api/intercom/user`, just the response
  object is slightly different
- /v1/mngmt/newrelic - the same as `auth_api/newrelic`, just the response
  object is slightly different
- GET /v1/secrets/ - to get user secrets - needed to get user company secrets to be
  used for getting API keys to Koldine Chat, Rewrite, AdaptiveReplace.

### Vector API

DEV: <https://pairlegaldev.singledraft.ai/vectorapi/>

PROD: No production deployment yet

Swagger: <https://pairlegaldev.singledraft.ai/vectorapi/v1/docs>

OpenAPI Spec: <https://pairlegaldev.singledraft.ai/vectorapi/v1/openapi.json>
