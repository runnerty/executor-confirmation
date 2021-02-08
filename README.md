<p align="center">
  <a href="http://runnerty.io">
    <img height="257" src="https://runnerty.io/assets/header/logo-stroked.png">
  </a>
  <p align="center">A new way for processes managing</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Dependency Status][david-badge]][david-badge-url]
<a href="#badge">
<img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
</a>

# Confirm executor for [Runnerty]:

Executor for Runnerty integrated with Telegram. It sends a message to your Telegram chat and waits for an answer to continue or stop the chain.

### Installation:

Through NPM

```bash
npm i @runnerty/executor-confirm
```

You can also add modules to your project with [runnerty-cli]

```bash
npx runnerty-cli add @runnerty/executor-confirm
```

This command installs the module in your project, adds example configuration in your `config.json` and creates an example plan of use.

If you have installed [runnerty-cli] globally you can include the module with this command:

```bash
rty add @runnerty/executor-confirm
```

### Configuration sample:

Add in [config.json]:

```json
{
  "id": "confirmation_default",
  "type": "@runnerty-executor-confirmation",
  "token": "ABC123",
  "chatId": "ABC123"
}
```

### Plan sample:

Add in [plan.json]:

```json
{
  "id": "confirmation_default",
  "message": "Message",
  "confirm_button_message": "ok button message",
  "cancel_button_message": "cancel button message",
  "confirm_message": "confirmation message",
  "cancel_message": "cancel message"
}
```

If you set a timeout to your proccess, by default, this will end with cancel. There is an optional field to configure that. If "ok" is indicated in this option, the process will end with ok.

```json
{
  "action_on_timeout": "ok"
}
```

There is also an option to include authorized users. Telegram's user name or Id can be indicated in this field. If it is included, only these users are allowed to interactuate.

```json
{
  "authorized_users": ["user_name_1", "user_id_2"]
}
```

[runnerty]: http://www.runnerty.io
[downloads-image]: https://img.shields.io/npm/dm/@runnerty/executor-confirmation.svg
[npm-url]: https://www.npmjs.com/package/@runnerty/executor-confirmation
[npm-image]: https://img.shields.io/npm/v/@runnerty/executor-confirmation.svg
[david-badge]: https://david-dm.org/runnerty/executor-confirmation.svg
[david-badge-url]: https://david-dm.org/runnerty/executor-confirmation
[config.json]: http://docs.runnerty.io/config/
[plan.json]: http://docs.runnerty.io/plan/
[runnerty-cli]: https://www.npmjs.com/package/runnerty-cli
