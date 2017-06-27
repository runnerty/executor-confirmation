# Confirm executor for [Runnerty]:

Executor for Runnerty integrated with Telegram. It sends a message to your Telegram chat and waits for an answer to continue or stop the chain. 

### Configuration sample:
```json
{
  "id": "confirmation_default",
  "type": "@runnerty-executor-confirmation",
  "token": "ABC123",
  "chatId": "ABC123"
}
```

### Plan sample:
```json
{
  "id":"confirmation_default",
  "message":"Message" ,
  "confirm_button_message":"ok button message",
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

[Runnerty]: http://www.runnerty.io