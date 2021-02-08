'use strict';

const telegramBot = require('node-telegram-bot-api');

const Executor = require('@runnerty/module-core').Executor;

class confirmExecutor extends Executor {
  constructor(process) {
    super(process);
    this.opts = {};
  }

  exec(params) {
    this.bot = new telegramBot(params.token, { polling: true });
    const chatId = params.chatId;
    const message = params.message;
    const confirmButtonMessage = params.confirm_button_message;
    const cancelButtonMessage = params.cancel_button_message;
    let confirmMessage = params.confirm_message;
    let cancelMessage = params.cancel_message;
    const authorizedUsers = params.authorized_users;
    let authorized = true;

    // Keyboard buttons with the options
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: confirmButtonMessage, callback_data: '1' }],
          [{ text: cancelButtonMessage, callback_data: '2' }]
        ]
      })
    };

    //Send a message with the process name.
    this.bot.sendMessage(chatId, message, options).then(sended => {
      this.opts = {
        chat_id: chatId,
        message_id: sended.message_id
      };
    });

    // Start polling waiting for the answer
    this.bot.on('callback_query', msg => {
      const back_message_id = msg.message.message_id;

      // Checks if the user who answered is in the authorized list if the param is received
      if (authorizedUsers && authorizedUsers.length) {
        authorized = false;
        for (let i = 0; i < authorizedUsers.length; i++) {
          if (authorizedUsers[i].name == msg.from.first_name || authorizedUsers[i].telegramId == msg.from.id) {
            authorized = true;
          }
        }
      }

      // check if the response belongs to the same messageId
      if (back_message_id == this.opts.message_id) {
        if (authorized) {
          if (msg.data == '1') {
            //Send the confirmation message with the name of the user who confirmed
            confirmMessage = confirmMessage + ' - ' + msg.from.first_name + ' ' + msg.from.last_name;
            this.bot.sendMessage(chatId, confirmMessage);

            //Stop polling
            this.bot.stopPolling();

            //Edit the message erasing the buttons
            this.bot.editMessageText(message, this.opts);

            //Process end ok
            this.end();
          } else {
            const endOptions = {
              end: 'error',
              messageLog: 'Chain stop forced by user ' + msg.from.first_name + ' ' + msg.from.last_name,
              err_output: 'Chain stop forced by user ' + msg.from.first_name + ' ' + msg.from.last_name
            };

            //Send the cancellation message with the name of the user who cancelled
            cancelMessage = cancelMessage + ' - ' + msg.from.first_name + ' ' + msg.from.last_name;
            this.bot.sendMessage(chatId, cancelMessage);

            //Stop polling
            this.bot.stopPolling();

            //Edit the message erasing the buttons
            this.bot.editMessageText(message, this.opts);

            //Process end error
            this.end(endOptions);
          }
        } else {
          const unauthorizedMessage = 'Sorry ' + msg.from.first_name + ', you are not authorized for the action';
          this.bot.sendMessage(chatId, unauthorizedMessage);
        }
      }
    });
  }

  kill(params, reason) {
    const chatId = params.chatId;
    const message = params.message;
    const action_on_timeout = params.action_on_timeout;

    // If the reason is timeout and the action_on_timeout is ok the process ends ok
    if (reason == 'timeout' && action_on_timeout == 'ok') {
      this.bot.stopPolling();

      //Send the confirmation message with the name of the user who confirmed
      const confirmMessage = 'Process timeout, action on timeout: ' + action_on_timeout + ', the chain continues';
      this.bot.sendMessage(chatId, confirmMessage);

      //Edit the message erasing the buttons
      this.bot.editMessageText(message, this.opts);

      //Process end ok*/
      this.end();
    } else {
      // Any other reason or no action defined on timeout the process ends with error
      const endOptions = {
        end: 'error',
        messageLog: 'Process killed, reason: ' + reason,
        err_output: 'Process killed, reason: ' + reason
      };

      //Stop polling
      this.bot.stopPolling();

      //Edit the message erasing the buttons
      this.bot.editMessageText(message, this.opts);

      //Send the cancellation message with the name of the user who cancelled
      const cancelMessage =
        'Procces killed, reason: ' + reason + ', action on timeout: ' + action_on_timeout + ', the chain stops.';
      this.bot.sendMessage(chatId, cancelMessage);

      //Process end error
      this.end(endOptions);
    }
  }
}

module.exports = confirmExecutor;
