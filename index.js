"use strict";

var TelegramBot = require("node-telegram-bot-api");

var Execution = global.ExecutionClass;

class confirmExecutor extends Execution {
  constructor(process) {
    super(process);
  }

  exec(params) {
    var _this = this;
    _this.bot = new TelegramBot(params.token, { polling: true });
    _this.opts = {};
    let chatId = params.chatId;
    let message = params.message;
    let confirmButtonMessage = params.confirm_button_message;
    let cancelButtonMessage = params.cancel_button_message;
    let confirmMessage = params.confirm_message;
    let cancelMessage = params.cancel_message;
    var authorizedUsers = params.authorized_users;
    var authorized = true;

    // Keyboard buttons with the options
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: confirmButtonMessage, callback_data: "1" }],
          [{ text: cancelButtonMessage, callback_data: "2" }]
        ]
      })
    };

    //Send a message with the process name.
    _this.bot.sendMessage(chatId, message, options).then(function (sended) {
      _this.opts = {
        chat_id: chatId,
        message_id: sended.message_id,
      };
    });

    // Start polling waiting for the answer
    _this.bot.on("callback_query", function (msg) {
      let back_message_id = msg.message.message_id;

      // Checks if the user who answered is in the authorized list if the param is received
      if (authorizedUsers && authorizedUsers.length) {
        authorized = false;
        for (var i = 0; i < authorizedUsers.length; i++) {
          if (authorizedUsers[i].name == msg.from.first_name || authorizedUsers[i].telegramId == msg.from.id) {
            authorized = true;
          }
        }
      }

      // check if the response belongs to the same messageId
      if (back_message_id == _this.opts.message_id) {
        if (authorized) {
          if (msg.data == "1") {

            //Send the confirmation message with the name of the user who confirmed
            confirmMessage = confirmMessage + " - " + msg.from.first_name + " " + msg.from.last_name;
            _this.bot.sendMessage(chatId, confirmMessage);

            //Stop polling
            _this.bot.stopPolling();

            //Edit the message erasing the buttons
            _this.bot.editMessageText(message, _this.opts);

            //Process end ok
            _this.end();
          } else {

            let endOptions = {
              end: "error",
              messageLog: "Chain stop forced by user " + msg.from.first_name + " " + msg.from.last_name,
              execute_err_return: "Chain stop forced by user " + msg.from.first_name + " " + msg.from.last_name
            };

            //Send the cancellation message with the name of the user who cancelled
            cancelMessage = cancelMessage + " - " + msg.from.first_name + " " + msg.from.last_name;
            _this.bot.sendMessage(chatId, cancelMessage);

            //Stop polling
            _this.bot.stopPolling();

            //Edit the message erasing the buttons
            _this.bot.editMessageText(message, _this.opts);

            //Process end error
            _this.end(endOptions);
          }
        } else {
          let unauthorizedMessage = "Sorry " + msg.from.first_name + ", you are not authorized for the action";
          _this.bot.sendMessage(chatId, unauthorizedMessage);
        }
      }
    });
  }

  kill(params, reason) {
    var _this = this;
    let chatId = params.chatId;
    let message = params.message;
    let action_on_timeout = params.action_on_timeout;

    // If the reason is timeout and the action_on_timeout is ok the process ends ok
    if (reason == "timeout" && action_on_timeout == "ok"){
      _this.bot.stopPolling();

      //Send the confirmation message with the name of the user who confirmed
      let confirmMessage = "Process timeout, action on timeout: " + action_on_timeout + ", the chain continues";
      _this.bot.sendMessage(chatId, confirmMessage);

      //Edit the message erasing the buttons
      _this.bot.editMessageText(message, _this.opts);

      //Process end ok*/
      _this.end();
    }else{
      // Any other reason or no action defined on timeout the process ends with error
      let endOptions = {
        end: "error",
        messageLog: "Process killed, reason: " + reason,
        execute_err_return: "Process killed, reason: " + reason
      };

      //Stop polling
      _this.bot.stopPolling();

      //Edit the message erasing the buttons
      _this.bot.editMessageText(message, _this.opts);

      //Send the cancellation message with the name of the user who cancelled
      let cancelMessage = "Procces killed, reason: " + reason + ", acation on timeout: "+ action_on_timeout + ", the chain stops.";
      _this.bot.sendMessage(chatId, cancelMessage);

      //Process end error
      _this.end(endOptions);
    }
  }
}

module.exports = confirmExecutor;
